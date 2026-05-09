package com.minor.elderlyCare.service;

import java.net.SocketTimeoutException;
import java.util.Locale;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.minor.elderlyCare.config.OllamaProperties;
import com.minor.elderlyCare.dto.response.VoiceResponseDTO;
import com.minor.elderlyCare.exception.OllamaTimeoutException;
import com.minor.elderlyCare.exception.OllamaUnavailableException;
import com.minor.elderlyCare.exception.VoiceIntentParsingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoiceIntentService {

    private record OllamaGenerateRequest(String model, String prompt, boolean stream) { }
    private record OllamaGenerateResponse(String response) { }

    private static final Set<String> ALLOWED_INTENTS = Set.of("ADD_MEDICINE", "REMOVE_MEDICINE", "QUERY");
    private static final Set<String> ALLOWED_FREQUENCIES = Set.of("DAILY", "WEEKLY", "ONCE");
    private final RestTemplate ollamaRestTemplate;

    private final ObjectMapper objectMapper;

    private final OllamaProperties ollamaProperties;

    public VoiceResponseDTO parseIntent(String text) {
        String prompt = buildPrompt(text);
        OllamaGenerateRequest payload = new OllamaGenerateRequest(
                ollamaProperties.getModel(),
                prompt,
                false
        );

        OllamaGenerateResponse llmBody = callOllama(payload);
        log.info("Raw Ollama response: {}", llmBody == null ? null : llmBody.response());

        if (llmBody == null || llmBody.response() == null || llmBody.response().isBlank()) {
            throw new VoiceIntentParsingException("Ollama returned an empty response");
        }

        String jsonOnly = extractJsonObject(llmBody.response());
        VoiceResponseDTO parsed = readVoiceResponse(jsonOnly);
        normalizeFields(parsed);
        log.info("Parsed JSON: intent={}, medicineName={}, time={}, frequency={}",
                parsed.getIntent(), parsed.getMedicineName(), parsed.getTime(), parsed.getFrequency());

        return parsed;
    }

    private OllamaGenerateResponse callOllama(OllamaGenerateRequest payload) {
        String endpoint = ollamaProperties.getBaseUrl() + "/api/generate";

        try {
            ResponseEntity<OllamaGenerateResponse> response =
                    ollamaRestTemplate.postForEntity(endpoint, payload, OllamaGenerateResponse.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new OllamaUnavailableException("Ollama returned non-success status: " + response.getStatusCode());
            }

            return response.getBody();
        } catch (ResourceAccessException ex) {
            if (isTimeout(ex)) {
                throw new OllamaTimeoutException("Timeout while calling Ollama", ex);
            }
            throw new OllamaUnavailableException("Ollama is not reachable at " + endpoint, ex);
        } catch (RestClientException ex) {
            throw new OllamaUnavailableException("Failed to call Ollama API", ex);
        }
    }

    private boolean isTimeout(Throwable throwable) {
        Throwable cursor = throwable;
        while (cursor != null) {
            if (cursor instanceof SocketTimeoutException) {
                return true;
            }
            cursor = cursor.getCause();
        }
        return false;
    }

    private VoiceResponseDTO readVoiceResponse(String jsonOnly) {
        try {
            return objectMapper.readValue(jsonOnly, VoiceResponseDTO.class);
        } catch (Exception ex) {
            throw new VoiceIntentParsingException("Could not parse JSON from LLM output", ex);
        }
    }

    private String extractJsonObject(String raw) {
        String trimmed = raw.trim();

        if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
            trimmed = stripCodeFence(trimmed);
        }

        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');

        if (start < 0 || end < start) {
            throw new VoiceIntentParsingException("LLM output did not contain a valid JSON object");
        }

        return trimmed.substring(start, end + 1);
    }

    private String stripCodeFence(String content) {
        String cleaned = content;
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring("```json".length());
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring("```".length());
        }

        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }

        return cleaned.trim();
    }

    private void normalizeFields(VoiceResponseDTO dto) {
        String rawIntent = dto.getIntent();
        dto.setIntent(normalizeIntent(dto.getIntent()));
        dto.setFrequency(normalizeFrequency(dto.getFrequency()));

        String time = dto.getTime();
        if (time != null) {
            String normalizedTime = time.trim();
            dto.setTime(normalizedTime.isEmpty() ? null : normalizedTime);
        }

        String medicineName = dto.getMedicineName();
        if (medicineName != null) {
            String normalizedName = medicineName.trim();
            dto.setMedicineName(normalizedName.isEmpty() ? null : toTitleCase(normalizedName));
        }

        log.info("Intent normalization: rawIntent={}, normalizedIntent={}", rawIntent, dto.getIntent());
    }

    private String normalizeIntent(String intent) {
        if (intent == null || intent.isBlank()) {
            return "UNKNOWN";
        }

        String normalized = intent.trim().toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_')
                .replaceAll("_+", "_");

        if (ALLOWED_INTENTS.contains(normalized)) {
            return normalized;
        }

        String collapsed = normalized.replace("_", "");
        if (collapsed.contains("ADD") && collapsed.contains("MEDICINE")) {
            return "ADD_MEDICINE";
        }
        if (collapsed.contains("REMOVE") && collapsed.contains("MEDICINE")) {
            return "REMOVE_MEDICINE";
        }
        if (collapsed.contains("QUERY") || collapsed.contains("VIEW") || collapsed.contains("SHOW")) {
            return "QUERY";
        }

        return "UNKNOWN";
    }

    private String normalizeFrequency(String frequency) {
        if (frequency == null || frequency.isBlank()) {
            return null;
        }

        String normalized = frequency.trim().toUpperCase(Locale.ROOT);
        return ALLOWED_FREQUENCIES.contains(normalized) ? normalized : null;
    }

    private String toTitleCase(String value) {
        String[] tokens = value.toLowerCase(Locale.ROOT).split("\\s+");
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < tokens.length; i++) {
            if (tokens[i].isEmpty()) {
                continue;
            }
            if (i > 0) {
                result.append(' ');
            }
            result.append(Character.toUpperCase(tokens[i].charAt(0)));
            if (tokens[i].length() > 1) {
                result.append(tokens[i].substring(1));
            }
        }

        return result.toString();
    }

    private String buildPrompt(String userText) {
        return """
                Convert the following sentence into structured JSON.

                Sentence:
                \"%s\"

                Return JSON with:
                - intent (ADD_MEDICINE, REMOVE_MEDICINE, QUERY)
                - medicineName
                - time (24-hour format HH:MM)
                - frequency (DAILY, WEEKLY, ONCE)

                Rules:
                - Use intent values exactly as ADD_MEDICINE, REMOVE_MEDICINE, or QUERY
                - Do not use spaces in intent values
                - If a field is missing, return null
                - Only return valid JSON
                - Do not include any explanation
                """.formatted(userText);
    }
}

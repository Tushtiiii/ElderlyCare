package com.minor.elderlyCare.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minor.elderlyCare.dto.request.VoiceRequestDTO;
import com.minor.elderlyCare.dto.response.CommandResponseDTO;
import com.minor.elderlyCare.dto.response.VoiceResponseDTO;
import com.minor.elderlyCare.exception.VoiceIntentParsingException;
import com.minor.elderlyCare.security.CustomUserPrincipal;
import com.minor.elderlyCare.service.CommandHandlerService;
import com.minor.elderlyCare.service.VoiceIntentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/voice")
@RequiredArgsConstructor
@Slf4j
public class VoiceIntentController {

    private final VoiceIntentService voiceIntentService;
    private final CommandHandlerService commandHandlerService;

    @PostMapping("/parse-intent")
    public ResponseEntity<CommandResponseDTO> parseIntent(
            @RequestBody VoiceRequestDTO request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        if (request == null || request.getText() == null || request.getText().isBlank()) {
            return ResponseEntity.ok(CommandResponseDTO.builder()
                    .message("Please say something")
                    .success(false)
                    .data(null)
                    .build());
        }

        log.info("User input text: {}", request.getText());

        try {
            VoiceResponseDTO parsed = voiceIntentService.parseIntent(request.getText());
            UUID elderId = request.getElderId() != null
                    ? request.getElderId()
                    : principal.getUser().getId();

            CommandResponseDTO response = commandHandlerService.executeCommand(
                    parsed,
                    elderId,
                    principal.getUser());

            return ResponseEntity.ok(response);
        } catch (VoiceIntentParsingException ex) {
            log.warn("Invalid JSON from LLM. Falling back to safe response.", ex);
            return ResponseEntity.ok(CommandResponseDTO.builder()
                    .message("Sorry, I didn't understand")
                    .success(false)
                    .data(null)
                    .build());
        }

    }
}
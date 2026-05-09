package com.minor.elderlyCare.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.minor.elderlyCare.dto.response.CommandResponseDTO;
import com.minor.elderlyCare.dto.response.VoiceResponseDTO;
import com.minor.elderlyCare.model.MedicineSchedule;
import com.minor.elderlyCare.model.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommandHandlerService {

    private final ElderAccessService elderAccessService;
    private final MedicineService medicineService;

        public CommandResponseDTO executeCommand(
            VoiceResponseDTO parsedIntent,
            UUID elderId,
            User currentUser) {

        elderAccessService.validateAccessAndGetElder(elderId, currentUser);
                VoiceResponseDTO normalized = normalizeForExecution(parsedIntent);

                String intent = canonicalIntent(normalized.getIntent());
        if (intent == null || intent.isBlank() || "UNKNOWN".equalsIgnoreCase(intent)) {
            log.info("Executed command: UNKNOWN for elderId={}", elderId);
                        return CommandResponseDTO.builder()
                                        .message("Sorry, I didn't understand")
                                        .success(false)
                                        .data(null)
                    .build();
        }

        return switch (intent.toUpperCase(Locale.ROOT)) {
                        case "ADD_MEDICINE" -> handleAddMedicine(normalized, elderId);
                        case "REMOVE_MEDICINE" -> handleRemoveMedicine(normalized, elderId);
                        case "QUERY" -> handleQuery(elderId);
            default -> {
                log.info("Executed command: UNSUPPORTED intent={} elderId={}", intent, elderId);
                                yield CommandResponseDTO.builder()
                                                .message("Sorry, I didn't understand")
                                                .success(false)
                                                .data(null)
                        .build();
            }
        };
    }

        private CommandResponseDTO handleAddMedicine(VoiceResponseDTO parsedIntent, UUID elderId) {
                if (isBlank(parsedIntent.getMedicineName())) {
                        return CommandResponseDTO.builder()
                                        .message("Which medicine should I add?")
                                        .success(false)
                                        .data(null)
                    .build();
        }

                if (isBlank(parsedIntent.getTime())) {
                        return CommandResponseDTO.builder()
                                        .message("At what time should I schedule it?")
                                        .success(false)
                                        .data(null)
                                        .build();
                }

        MedicineSchedule saved = medicineService.addMedicine(elderId, parsedIntent);
        log.info("Executed command: ADD_MEDICINE elderId={} medicineName={} time={}",
                elderId, saved.getMedicineName(), saved.getTime());

        String frequencyText = saved.getFrequency() == null
                ? ""
                : " " + saved.getFrequency().toLowerCase(Locale.ROOT);

                return CommandResponseDTO.builder()
                .message("Medicine " + saved.getMedicineName() + " scheduled at "
                        + saved.getTime() + frequencyText)
                                .success(true)
                .data(saved)
                .build();
    }

        private CommandResponseDTO handleRemoveMedicine(VoiceResponseDTO parsedIntent, UUID elderId) {
        if (isBlank(parsedIntent.getMedicineName())) {
                        return CommandResponseDTO.builder()
                                        .message("Which medicine should I remove?")
                                        .success(false)
                                        .data(null)
                    .build();
        }

        long removedCount = medicineService.removeMedicine(elderId, parsedIntent.getMedicineName());
        log.info("Executed command: REMOVE_MEDICINE elderId={} medicineName={} removedCount={}",
                elderId, parsedIntent.getMedicineName(), removedCount);

        if (removedCount == 0) {
                        return CommandResponseDTO.builder()
                                        .message("Medicine not found")
                                        .success(false)
                                        .data(null)
                    .build();
        }

                return CommandResponseDTO.builder()
                                .message("Medicine " + parsedIntent.getMedicineName() + " removed successfully")
                                .success(true)
                                .data(null)
                .build();
    }

        private CommandResponseDTO handleQuery(UUID elderId) {
        List<MedicineSchedule> medicines = medicineService.getMedicinesByElder(elderId);
        log.info("Executed command: QUERY elderId={} medicinesCount={}", elderId, medicines.size());

                List<Map<String, String>> responseItems = medicines.stream()
                                .map(this::toMedicineView)
                                .toList();

                String message = medicines.isEmpty()
                                ? "You do not have any medicines scheduled"
                                : "You have " + medicines.size() + " medicines scheduled today";

                return CommandResponseDTO.builder()
                                .message(message)
                                .success(true)
                                .data(responseItems)
                .build();
    }

        private Map<String, String> toMedicineView(MedicineSchedule schedule) {
                Map<String, String> view = new LinkedHashMap<>();
                view.put("medicineName", schedule.getMedicineName());
                view.put("time", schedule.getTime());
                view.put("frequency", schedule.getFrequency());
                return view;
        }

        private VoiceResponseDTO normalizeForExecution(VoiceResponseDTO parsedIntent) {
                VoiceResponseDTO normalized = new VoiceResponseDTO();
                normalized.setIntent(parsedIntent == null ? null : parsedIntent.getIntent());
                normalized.setMedicineName(normalizeMedicineName(parsedIntent == null ? null : parsedIntent.getMedicineName()));
                normalized.setTime(normalizeTime(parsedIntent == null ? null : parsedIntent.getTime()));
                normalized.setFrequency(normalizeFrequency(parsedIntent == null ? null : parsedIntent.getFrequency()));
                return normalized;
        }

        private String normalizeMedicineName(String medicineName) {
                if (isBlank(medicineName)) {
                        return null;
                }

                String[] tokens = medicineName.trim().toLowerCase(Locale.ROOT).split("\\s+");
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

        private String normalizeFrequency(String frequency) {
                if (isBlank(frequency)) {
                        return null;
                }

                return frequency.trim().toUpperCase(Locale.ROOT);
        }

                private String canonicalIntent(String intent) {
                        if (isBlank(intent)) {
                                return "UNKNOWN";
                        }

                        return intent.trim().toUpperCase(Locale.ROOT)
                                        .replace('-', '_')
                                        .replace(' ', '_')
                                        .replaceAll("_+", "_");
                }

        private String normalizeTime(String rawTime) {
                if (isBlank(rawTime)) {
                        return null;
                }

                String value = rawTime.trim().toLowerCase(Locale.ROOT).replace(".", "");

                if (value.matches("^([01]?\\d|2[0-3]):[0-5]\\d$")) {
                        String[] parts = value.split(":");
                        return String.format("%02d:%02d", Integer.parseInt(parts[0]), Integer.parseInt(parts[1]));
                }

                if (value.matches("^([01]?\\d|2[0-3])$")) {
                        return String.format("%02d:00", Integer.parseInt(value));
                }

                java.util.regex.Matcher m = java.util.regex.Pattern
                                .compile("^(1[0-2]|0?[1-9])(?::([0-5]\\d))?\\s*(am|pm)$")
                                .matcher(value);
                if (m.matches()) {
                        int hour = Integer.parseInt(m.group(1));
                        int minute = m.group(2) == null ? 0 : Integer.parseInt(m.group(2));
                        String meridiem = m.group(3);

                        if ("pm".equals(meridiem) && hour != 12) {
                                hour += 12;
                        }
                        if ("am".equals(meridiem) && hour == 12) {
                                hour = 0;
                        }

                        return String.format("%02d:%02d", hour, minute);
                }

                return null;
        }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

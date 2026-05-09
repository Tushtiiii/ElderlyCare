package com.minor.elderlyCare.service;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minor.elderlyCare.dto.response.VoiceResponseDTO;
import com.minor.elderlyCare.model.MedicineSchedule;
import com.minor.elderlyCare.repository.MedicineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    @Transactional
    public MedicineSchedule addMedicine(UUID elderId, VoiceResponseDTO parsedIntent) {
        MedicineSchedule schedule = MedicineSchedule.builder()
                .elderId(elderId)
                .medicineName(toTitleCase(parsedIntent.getMedicineName()))
                .time(parsedIntent.getTime())
                .frequency(parsedIntent.getFrequency())
                .build();

        return medicineRepository.save(schedule);
    }

    @Transactional
    public long removeMedicine(UUID elderId, String medicineName) {
        return medicineRepository.deleteByElderIdAndMedicineNameIgnoreCase(
                elderId,
                medicineName.trim());
    }

    @Transactional(readOnly = true)
    public List<MedicineSchedule> getMedicinesByElder(UUID elderId) {
        return medicineRepository.findByElderIdOrderByCreatedAtDesc(elderId);
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
}

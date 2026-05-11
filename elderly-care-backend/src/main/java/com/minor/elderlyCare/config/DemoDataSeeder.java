package com.minor.elderlyCare.config;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.minor.elderlyCare.model.ElderChildRelationship;
import com.minor.elderlyCare.model.Medication;
import com.minor.elderlyCare.model.MedicineSchedule;
import com.minor.elderlyCare.model.RelationshipStatus;
import com.minor.elderlyCare.model.Role;
import com.minor.elderlyCare.model.User;
import com.minor.elderlyCare.model.VitalRecord;
import com.minor.elderlyCare.model.VitalType;
import com.minor.elderlyCare.repository.ElderChildRelationshipRepository;
import com.minor.elderlyCare.repository.MedicationRepository;
import com.minor.elderlyCare.repository.MedicineRepository;
import com.minor.elderlyCare.repository.UserRepository;
import com.minor.elderlyCare.repository.VitalRecordRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DemoDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ElderChildRelationshipRepository relationshipRepository;
    private final VitalRecordRepository vitalRecordRepository;
    private final MedicationRepository medicationRepository;
    private final MedicineRepository medicineRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String elderEmail = "elder.demo@elderlycare.app";
        if (userRepository.existsByEmailIgnoreCase(elderEmail)) {
            return;
        }

        User elder = User.builder()
                .name("Elder Demo")
                .email(elderEmail)
                .passwordHash(passwordEncoder.encode("Password@123"))
                .phone("+1111111111")
                .role(Role.ELDER)
                .dateOfBirth(LocalDate.of(1950, 5, 18))
                .build();

        User child = User.builder()
                .name("Child Demo")
                .email("child.demo@elderlycare.app")
                .passwordHash(passwordEncoder.encode("Password@123"))
                .phone("+1222222222")
                .role(Role.CHILD)
                .dateOfBirth(LocalDate.of(1990, 3, 12))
                .build();

        User doctor = User.builder()
                .name("Doctor Demo")
                .email("doctor.demo@elderlycare.app")
                .passwordHash(passwordEncoder.encode("Password@123"))
                .phone("+1333333333")
                .role(Role.DOCTOR)
                .dateOfBirth(LocalDate.of(1985, 11, 2))
                .build();

        User pathologist = User.builder()
                .name("Pathologist Demo")
                .email("pathologist.demo@elderlycare.app")
                .passwordHash(passwordEncoder.encode("Password@123"))
                .phone("+1444444444")
                .role(Role.PATHOLOGIST)
                .dateOfBirth(LocalDate.of(1987, 8, 21))
                .build();

        userRepository.saveAll(List.of(elder, child, doctor, pathologist));

        createRelationship(elder, child, child);
        createRelationship(elder, doctor, doctor);
        createRelationship(elder, pathologist, pathologist);

        seedVitals(elder);
        seedMedications(elder);
        seedMedicineSchedules(elder);
    }

    private void createRelationship(User elder, User child, User requestedBy) {
        if (relationshipRepository.existsByElderIdAndChildId(elder.getId(), child.getId())) {
            return;
        }

        ElderChildRelationship relationship = ElderChildRelationship.builder()
                .elder(elder)
                .child(child)
                .requestedBy(requestedBy)
                .status(RelationshipStatus.ACTIVE)
                .build();

        relationshipRepository.save(relationship);
    }

    private void seedVitals(User elder) {
        List<VitalRecord> vitals = List.of(
                VitalRecord.builder()
                        .elder(elder)
                        .vitalType(VitalType.BLOOD_PRESSURE)
                        .value(128.0)
                        .secondaryValue(82.0)
                        .unit(VitalType.BLOOD_PRESSURE.getUnit())
                        .notes("Morning reading")
                        .recordedAt(Instant.now().minusSeconds(3600 * 24))
                        .isAbnormal(false)
                        .build(),
                VitalRecord.builder()
                        .elder(elder)
                        .vitalType(VitalType.HEART_RATE)
                        .value(76.0)
                        .unit(VitalType.HEART_RATE.getUnit())
                        .notes("Post-walk")
                        .recordedAt(Instant.now().minusSeconds(3600 * 18))
                        .isAbnormal(false)
                        .build(),
                VitalRecord.builder()
                        .elder(elder)
                        .vitalType(VitalType.BLOOD_SUGAR)
                        .value(138.0)
                        .unit(VitalType.BLOOD_SUGAR.getUnit())
                        .notes("After breakfast")
                        .recordedAt(Instant.now().minusSeconds(3600 * 12))
                        .isAbnormal(false)
                        .build(),
                VitalRecord.builder()
                        .elder(elder)
                        .vitalType(VitalType.OXYGEN_SATURATION)
                        .value(96.0)
                        .unit(VitalType.OXYGEN_SATURATION.getUnit())
                        .notes("Resting")
                        .recordedAt(Instant.now().minusSeconds(3600 * 6))
                        .isAbnormal(false)
                        .build(),
                VitalRecord.builder()
                        .elder(elder)
                        .vitalType(VitalType.TEMPERATURE)
                        .value(98.2)
                        .unit(VitalType.TEMPERATURE.getUnit())
                        .notes("Evening check")
                        .recordedAt(Instant.now().minusSeconds(3600 * 2))
                        .isAbnormal(false)
                        .build()
        );

        vitalRecordRepository.saveAll(vitals);
    }

    private void seedMedications(User elder) {
        List<Medication> medications = List.of(
                Medication.builder()
                        .elder(elder)
                        .medicineName("Metformin")
                        .dosage("500 mg")
                        .frequency("Twice daily")
                        .reminderTime(LocalTime.of(8, 0))
                        .startDate(LocalDate.now().minusDays(60))
                        .notes("Take with breakfast")
                        .isActive(true)
                        .build(),
                Medication.builder()
                        .elder(elder)
                        .medicineName("Atorvastatin")
                        .dosage("10 mg")
                        .frequency("Once daily")
                        .reminderTime(LocalTime.of(20, 0))
                        .startDate(LocalDate.now().minusDays(30))
                        .notes("Evening dose")
                        .isActive(true)
                        .build()
        );

        medicationRepository.saveAll(medications);
    }

    private void seedMedicineSchedules(User elder) {
        List<MedicineSchedule> schedules = List.of(
                MedicineSchedule.builder()
                        .elderId(elder.getId())
                        .medicineName("Metformin")
                        .time("08:00")
                        .frequency("DAILY")
                        .build(),
                MedicineSchedule.builder()
                        .elderId(elder.getId())
                        .medicineName("Atorvastatin")
                        .time("20:00")
                        .frequency("DAILY")
                        .build()
        );

        medicineRepository.saveAll(schedules);
    }
}

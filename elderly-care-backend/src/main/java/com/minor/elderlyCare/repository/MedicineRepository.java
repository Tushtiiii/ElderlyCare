package com.minor.elderlyCare.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.minor.elderlyCare.model.MedicineSchedule;

@Repository
public interface MedicineRepository extends JpaRepository<MedicineSchedule, UUID> {

    List<MedicineSchedule> findByElderIdOrderByCreatedAtDesc(UUID elderId);

    long deleteByElderIdAndMedicineNameIgnoreCase(UUID elderId, String medicineName);
}

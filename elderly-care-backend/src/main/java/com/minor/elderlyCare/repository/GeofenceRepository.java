package com.minor.elderlyCare.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.minor.elderlyCare.model.Geofence;

@Repository
public interface GeofenceRepository extends JpaRepository<Geofence, UUID> {
    Optional<Geofence> findByElderIdAndIsActiveTrue(UUID elderId);
}

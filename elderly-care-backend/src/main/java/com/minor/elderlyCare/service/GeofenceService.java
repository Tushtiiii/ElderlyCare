package com.minor.elderlyCare.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minor.elderlyCare.dto.request.GeofenceRequest;
import com.minor.elderlyCare.dto.request.UpdateGeofenceRequest;
import com.minor.elderlyCare.dto.response.GeofenceResponse;
import com.minor.elderlyCare.exception.ResourceNotFoundException;
import com.minor.elderlyCare.model.Geofence;
import com.minor.elderlyCare.repository.GeofenceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GeofenceService {

    private final GeofenceRepository geofenceRepository;

    @Transactional
    public GeofenceResponse createOrReplaceGeofence(GeofenceRequest request) {
        // Find existing active geofence for the elder
        geofenceRepository.findByElderIdAndIsActiveTrue(request.getElderId())
                .ifPresent(existingGeofence -> {
                    existingGeofence.setIsActive(false);
                    geofenceRepository.save(existingGeofence);
                });

        // Create new geofence
        Geofence geofence = Geofence.builder()
                .elderId(request.getElderId())
                .guardianId(request.getGuardianId())
                .centerLatitude(request.getCenterLatitude())
                .centerLongitude(request.getCenterLongitude())
                .radiusMeters(request.getRadiusMeters())
                .isActive(true)
                .build();

        Geofence savedGeofence = geofenceRepository.save(geofence);
        return mapToResponse(savedGeofence);
    }

    @Transactional(readOnly = true)
    public GeofenceResponse getActiveGeofenceByElderId(UUID elderId) {
        Geofence geofence = geofenceRepository.findByElderIdAndIsActiveTrue(elderId)
                .orElseThrow(() -> new ResourceNotFoundException("Active geofence not found for elder: " + elderId));
        return mapToResponse(geofence);
    }

    @Transactional
    public GeofenceResponse updateGeofence(UUID id, UpdateGeofenceRequest request) {
        Geofence geofence = geofenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Geofence not found with id: " + id));

        geofence.setCenterLatitude(request.getCenterLatitude());
        geofence.setCenterLongitude(request.getCenterLongitude());
        geofence.setRadiusMeters(request.getRadiusMeters());

        Geofence updatedGeofence = geofenceRepository.save(geofence);
        return mapToResponse(updatedGeofence);
    }

    @Transactional
    public void deleteGeofence(UUID id) {
        if (!geofenceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Geofence not found with id: " + id);
        }
        geofenceRepository.deleteById(id);
    }

    private GeofenceResponse mapToResponse(Geofence geofence) {
        return GeofenceResponse.builder()
                .id(geofence.getId())
                .elderId(geofence.getElderId())
                .guardianId(geofence.getGuardianId())
                .centerLatitude(geofence.getCenterLatitude())
                .centerLongitude(geofence.getCenterLongitude())
                .radiusMeters(geofence.getRadiusMeters())
                .isActive(geofence.getIsActive())
                .createdAt(geofence.getCreatedAt())
                .updatedAt(geofence.getUpdatedAt())
                .build();
    }
}

package com.minor.elderlyCare.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minor.elderlyCare.dto.request.GeofenceRequest;
import com.minor.elderlyCare.dto.request.UpdateGeofenceRequest;
import com.minor.elderlyCare.dto.response.GeofenceResponse;
import com.minor.elderlyCare.service.GeofenceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/geofences")
@RequiredArgsConstructor
public class GeofenceController {

    private final GeofenceService geofenceService;

    @PostMapping
    public ResponseEntity<GeofenceResponse> createGeofence(@Valid @RequestBody GeofenceRequest request) {
        return new ResponseEntity<>(geofenceService.createOrReplaceGeofence(request), HttpStatus.CREATED);
    }

    @GetMapping("/elder/{elderId}")
    public ResponseEntity<GeofenceResponse> getActiveGeofence(@PathVariable UUID elderId) {
        return ResponseEntity.ok(geofenceService.getActiveGeofenceByElderId(elderId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GeofenceResponse> updateGeofence(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateGeofenceRequest request) {
        return ResponseEntity.ok(geofenceService.updateGeofence(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGeofence(@PathVariable UUID id) {
        geofenceService.deleteGeofence(id);
        return ResponseEntity.noContent().build();
    }
}

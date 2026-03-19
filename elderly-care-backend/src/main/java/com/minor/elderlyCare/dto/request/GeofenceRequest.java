package com.minor.elderlyCare.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeofenceRequest {

    @NotNull(message = "Elder ID is required")
    private UUID elderId;

    @NotNull(message = "Guardian ID is required")
    private UUID guardianId;

    @NotNull(message = "Center latitude is required")
    @Min(value = -90, message = "Latitude must be between -90 and 90")
    @Max(value = 90, message = "Latitude must be between -90 and 90")
    private Double centerLatitude;

    @NotNull(message = "Center longitude is required")
    @Min(value = -180, message = "Longitude must be between -180 and 180")
    @Max(value = 180, message = "Longitude must be between -180 and 180")
    private Double centerLongitude;

    @NotNull(message = "Radius is required")
    @Min(value = 50, message = "Radius must be at least 50 meters")
    @Max(value = 5000, message = "Radius must not exceed 5000 meters")
    private Integer radiusMeters;
}

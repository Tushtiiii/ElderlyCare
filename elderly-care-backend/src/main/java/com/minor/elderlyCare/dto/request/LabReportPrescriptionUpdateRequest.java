package com.minor.elderlyCare.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabReportPrescriptionUpdateRequest {

    @Size(max = 2000)
    private String prescription;
}

package com.minor.elderlyCare.dto.request;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request body for creating a lab report.
 *
 * Example JSON:
 * {
 *   "elderId": "550e8400-e29b-41d4-a716-446655440000",
 *   "testName": "Complete Blood Count",
 *   "result": "Hemoglobin: 13.2 g/dL, WBC: 7800/mcL",
 *   "testDate": "2026-03-01",
 *   "fileUrl": "https://storage.example.com/reports/cbc-20260301.pdf",
 *   "notes": "All values normal"
 * }
 */
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabReportRequest {

    @NotNull(message = "Elder ID is required")
    private UUID elderId;

    @NotBlank(message = "Test name is required")
    @Size(max = 200)
    private String testName;

    @NotBlank(message = "Result is required")
    @Size(max = 500)
    private String result;

    @NotNull(message = "Test date is required")
    private LocalDate testDate;

    /** URL of the uploaded PDF. Can be null if no file was uploaded. */
    private String fileUrl;

    /** Extra structured data for the report (e.g. hemoglobin: 13.2) */
    private java.util.Map<String, Object> dynamicData;

    private String notes;
}

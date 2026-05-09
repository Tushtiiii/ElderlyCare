package com.minor.elderlyCare.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minor.elderlyCare.dto.request.LabReportPrescriptionUpdateRequest;
import com.minor.elderlyCare.dto.request.LabReportRequest;
import com.minor.elderlyCare.dto.response.LabReportResponse;
import com.minor.elderlyCare.security.CustomUserPrincipal;
import com.minor.elderlyCare.service.LabReportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for managing lab reports.
 *
 * <h3>Endpoints:</h3>
 * <pre>
 * POST   /api/lab-reports                           — Create lab report
 * GET    /api/lab-reports/elder/{elderId}           — All reports (paginated)
 * GET    /api/lab-reports/elder/{elderId}/search?testName=...  — Search by test name
 * GET    /api/lab-reports/{id}                      — Single report
 * PATCH  /api/lab-reports/{id}/prescription         — Update prescription text
 * DELETE /api/lab-reports/{id}                      — Delete report
 * </pre>
 */
@RestController
@RequestMapping("/api/lab-reports")
@RequiredArgsConstructor
public class LabReportController {

    private final LabReportService labReportService;

    /**
     * Create a new lab report.
     *
     * Example request:
     * POST /api/lab-reports
     * {
     *   "elderId": "550e8400-e29b-41d4-a716-446655440000",
     *   "testName": "Complete Blood Count",
     *   "result": "Hemoglobin: 13.2 g/dL, WBC: 7800/mcL",
     *   "testDate": "2026-03-01",
     *   "fileUrl": "https://storage.example.com/reports/cbc-20260301.pdf",
     *   "notes": "All values normal"
     * }
     */
    @PostMapping
    public ResponseEntity<LabReportResponse> createLabReport(
            @Valid @RequestBody LabReportRequest request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(labReportService.createLabReport(request, principal.getUser()));
    }

    /** Get all lab reports for an elder (paginated). */
    @GetMapping("/elder/{elderId}")
    public ResponseEntity<Page<LabReportResponse>> getLabReports(
            @PathVariable UUID elderId,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        return ResponseEntity.ok(
                labReportService.getLabReports(elderId, principal.getUser(), pageable));
    }

    /** Search lab reports by test name (case-insensitive). */
    @GetMapping("/elder/{elderId}/search")
    public ResponseEntity<Page<LabReportResponse>> searchLabReports(
            @PathVariable UUID elderId,
            @RequestParam String testName,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        return ResponseEntity.ok(
                labReportService.searchLabReports(elderId, testName, principal.getUser(), pageable));
    }

    /** Get a single lab report by ID. */
    @GetMapping("/{id}")
    public ResponseEntity<LabReportResponse> getLabReport(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        return ResponseEntity.ok(
                labReportService.getLabReport(id, principal.getUser()));
    }

        /** Update prescription text for an existing lab report. */
        @PatchMapping("/{id}/prescription")
        public ResponseEntity<LabReportResponse> updatePrescription(
                        @PathVariable UUID id,
                        @Valid @RequestBody LabReportPrescriptionUpdateRequest request,
                        @AuthenticationPrincipal CustomUserPrincipal principal) {

                return ResponseEntity.ok(
                                labReportService.updatePrescription(id, request.getPrescription(), principal.getUser()));
        }

    /** Delete a lab report. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabReport(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        labReportService.deleteLabReport(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }
}

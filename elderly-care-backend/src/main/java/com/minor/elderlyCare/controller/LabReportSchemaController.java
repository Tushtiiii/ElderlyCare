package com.minor.elderlyCare.controller;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@RestController
@RequestMapping("/api/report-schemas")
public class LabReportSchemaController {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FormField {
        private String name;
        private String label;
        private String type; // text, number, date, select
        private boolean required;
        private List<String> options;
        private String placeholder;
        private String unit;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReportSchema {
        private String type;
        private String displayName;
        private List<FormField> fields;
    }

    @GetMapping("/{type}")
    public ResponseEntity<ReportSchema> getSchema(@PathVariable String type) {
        ReportSchema schema = switch (type.toUpperCase()) {
            case "BLOOD_TEST" -> ReportSchema.builder()
                    .type("BLOOD_TEST")
                    .displayName("Blood Test Report")
                    .fields(Arrays.asList(
                            FormField.builder().name("hemoglobin").label("Hemoglobin").type("number").unit("g/dL").required(true).build(),
                            FormField.builder().name("wbcCount").label("WBC Count").type("number").unit("cells/mcL").required(true).build(),
                            FormField.builder().name("platelets").label("Platelets").type("number").unit("cells/mcL").required(true).build()
                    ))
                    .build();
            case "ECG" -> ReportSchema.builder()
                    .type("ECG")
                    .displayName("ECG/EKG Report")
                    .fields(Arrays.asList(
                            FormField.builder().name("heartRate").label("Heart Rate").type("number").unit("bpm").required(true).build(),
                            FormField.builder().name("rhythm").label("Rhythm").type("text").placeholder("e.g. Sinus Rhythm").required(true).build(),
                            FormField.builder().name("interpretation").label("Interpretation").type("text").required(false).build()
                    ))
                    .build();
            case "URINE_TEST" -> ReportSchema.builder()
                    .type("URINE_TEST")
                    .displayName("Urine Analysis")
                    .fields(Arrays.asList(
                            FormField.builder().name("color").label("Color").type("text").required(true).build(),
                            FormField.builder().name("ph").label("pH Level").type("number").required(true).build(),
                            FormField.builder().name("protein").label("Protein").type("select").options(Arrays.asList("Negative", "Trace", "1+", "2+", "3+")).required(true).build()
                    ))
                    .build();
            default -> ReportSchema.builder()
                    .type("GENERAL")
                    .displayName("General Lab Report")
                    .fields(Collections.emptyList())
                    .build();
        };

        return ResponseEntity.ok(schema);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getAvailableTypes() {
        return ResponseEntity.ok(Arrays.asList(
            Map.of("type", "BLOOD_TEST", "label", "Blood Test"),
            Map.of("type", "ECG", "label", "ECG"),
            Map.of("type", "URINE_TEST", "label", "Urine Test"),
            Map.of("type", "GENERAL", "label", "General")
        ));
    }
}

package com.minor.elderlyCare.model;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Stores lab test reports for an elder.
 *
 * The actual PDF / image file is stored in object storage (S3 / Azure Blob);
 * this entity keeps only the URL pointer ({@code fileUrl}).
 */
@Entity
@Table(
    name = "lab_reports",
    indexes = {
        @Index(name = "idx_lr_elder_id",   columnList = "elder_id"),
        @Index(name = "idx_lr_test_date",  columnList = "test_date")
    }
)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "elder_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_lr_elder"))
    private User elder;

    @NotBlank
    @Size(max = 200)
    @Column(name = "test_name", nullable = false, length = 200)
    private String testName;

    @Size(max = 500)
    @Column(name = "result", length = 500)
    private String result;

    @Size(max = 200)
    @Column(name = "uploaded_by", length = 200)
    private String uploadedBy;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dynamic_data")
    private Map<String, Object> dynamicData;

    @NotNull
    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    /** URL of the uploaded PDF / image stored in object storage. */
    @Column(name = "file_url", length = 1000)
    private String fileUrl;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "prescription", length = 2000)
    private String prescription;

    // ── Audit Timestamps ─────────────────────────────────────────────────────
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}

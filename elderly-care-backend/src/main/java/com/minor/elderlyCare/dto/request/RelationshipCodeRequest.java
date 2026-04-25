package com.minor.elderlyCare.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Payload for POST /api/relationships/request-by-code
 *
 * Used by non-elder users (guardian/doctor/pathologist) to initiate a
 * monitoring relationship with an elder using the elder's care code.
 */
@Data
public class RelationshipCodeRequest {

    /**
     * Care code of the elder to connect with.
     * In this implementation the code is simply the elder's UUID string.
     */
    @NotBlank(message = "Care code is required")
    private String elderCode;
}

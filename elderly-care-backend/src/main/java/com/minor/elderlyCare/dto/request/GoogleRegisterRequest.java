package com.minor.elderlyCare.dto.request;

import com.minor.elderlyCare.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

/**
 * Payload for POST /api/auth/google/register.
 */
@Data
public class GoogleRegisterRequest {

    /** Google ID token obtained from the client-side OAuth flow. */
    @NotBlank(message = "Google ID token is required")
    private String idToken;

    @NotNull(message = "Role is required")
    private Role role;

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "Invalid phone number format")
    private String phone;

    private LocalDate dateOfBirth;

    /**
     * FCM / APNs push token — optional, same semantics as LoginRequest.
     * Send if the user has granted notification permission.
     */
    private String pushToken;
}

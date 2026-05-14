package com.minor.elderlyCare.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Payload for POST /api/auth/google.
 *
 * The React Native app performs the Google OAuth browser flow itself,
 * obtains an ID token, and sends it here for backend verification.
 * The backend verifies the token against Google's public keys and,
 * if valid, issues an app-scoped JWT.
 */
@Data
public class GoogleAuthRequest {

    /** Google ID token obtained from the client-side OAuth flow. */
    @NotBlank(message = "Google ID token is required")
    private String idToken;

    /**
     * FCM / APNs push token — optional, same semantics as LoginRequest.
     * Send if the user has granted notification permission.
     */
    private String pushToken;
}

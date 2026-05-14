package com.minor.elderlyCare.controller;

import com.minor.elderlyCare.dto.request.GoogleAuthRequest;
import com.minor.elderlyCare.dto.request.GoogleRegisterRequest;
import com.minor.elderlyCare.dto.request.LoginRequest;
import com.minor.elderlyCare.dto.request.RegisterRequest;
import com.minor.elderlyCare.dto.response.AuthResponse;
import com.minor.elderlyCare.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Register a new user (ELDER or CHILD).
     * Returns 201 Created with a JWT so the app can log in immediately.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    /**
     * POST /api/auth/login
     * Authenticate with email + password.
     * Returns 200 OK with a JWT Bearer token.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * POST /api/auth/google
     * Sign in with an existing account using a Google ID token.
     * The token is verified against Google's public keys on the backend.
     * Returns 200 OK with a JWT Bearer token.
     */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @Valid @RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    /**
     * POST /api/auth/google/register
     * Create a new account using a Google ID token.
     * Fails with 409 if the email is already registered.
     * Returns 201 Created with a JWT Bearer token.
     */
    @PostMapping("/google/register")
    public ResponseEntity<AuthResponse> googleRegister(
            @Valid @RequestBody GoogleRegisterRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.googleRegister(request));
    }
}

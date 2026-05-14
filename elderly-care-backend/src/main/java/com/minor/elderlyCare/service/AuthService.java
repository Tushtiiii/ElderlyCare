package com.minor.elderlyCare.service;

import com.minor.elderlyCare.dto.request.GoogleAuthRequest;
import com.minor.elderlyCare.dto.request.GoogleRegisterRequest;
import com.minor.elderlyCare.dto.request.LoginRequest;
import com.minor.elderlyCare.dto.request.RegisterRequest;
import com.minor.elderlyCare.dto.response.AuthResponse;
import com.minor.elderlyCare.exception.DuplicateResourceException;
import com.minor.elderlyCare.model.User;
import com.minor.elderlyCare.repository.UserRepository;
import com.minor.elderlyCare.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository       userRepository;
    private final PasswordEncoder      passwordEncoder;
    private final JwtUtil              jwtUtil;
    private final AuthenticationManager authenticationManager;

    // ── Register ──────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest req) {

        if (userRepository.existsByEmailIgnoreCase(req.getEmail())) {
            throw new DuplicateResourceException(
                    "Email is already registered: " + req.getEmail());
        }

        if (StringUtils.hasText(req.getPhone())
                && userRepository.existsByPhone(req.getPhone())) {
            throw new DuplicateResourceException(
                    "Phone number is already registered: " + req.getPhone());
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(req.getRole())
                .dateOfBirth(req.getDateOfBirth())
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest req) {

        // Validates credentials — throws BadCredentialsException on failure
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail().toLowerCase(), req.getPassword()));

        User user = userRepository
                .findByEmailIgnoreCase(req.getEmail())
                .orElseThrow();

        // Update the device push token on every login
        if (StringUtils.hasText(req.getPushToken())) {
            user.setPushToken(req.getPushToken());
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(
                user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    // ── Google OAuth ──────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse googleLogin(GoogleAuthRequest req) {
        Map<String, Object> payload = verifyGoogleToken(req.getIdToken());
        String email = (String) payload.get("email");

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No account found for this Google account. Please register first."));

        if (StringUtils.hasText(req.getPushToken())) {
            user.setPushToken(req.getPushToken());
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(
                user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    @Transactional
    public AuthResponse googleRegister(GoogleRegisterRequest req) {
        Map<String, Object> payload = verifyGoogleToken(req.getIdToken());

        String email = ((String) payload.get("email")).toLowerCase();
        String nameFromToken = (String) payload.getOrDefault("name", email);
        String name = StringUtils.hasText(req.getName()) ? req.getName() : nameFromToken;

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException(
                    "Email is already registered: " + email);
        }

        if (StringUtils.hasText(req.getPhone())
            && userRepository.existsByPhone(req.getPhone())) {
            throw new DuplicateResourceException(
                "Phone number is already registered: " + req.getPhone());
        }

        // Google users never set a local password — use a random secure placeholder.
        // They authenticate exclusively via the Google OAuth flow.
        User user = User.builder()
                .name(name)
                .email(email)
                .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
            .phone(req.getPhone())
            .role(req.getRole())
            .dateOfBirth(req.getDateOfBirth())
                .build();

        if (StringUtils.hasText(req.getPushToken())) {
            user.setPushToken(req.getPushToken());
        }

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresIn(jwtUtil.getExpirationMs())
                .build();
    }

    /**
     * Verifies a Google ID token using Google's tokeninfo endpoint.
     * Returns the token payload (email, name, sub, etc.) on success.
     * Throws 401 if the token is invalid or the email is not verified.
     *
     * Uses Spring's RestTemplate (already available via spring-boot-starter-web)
     * so no extra Maven dependency is needed.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> verifyGoogleToken(String idToken) {
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> payload = restTemplate.getForObject(url, Map.class);

            if (payload == null) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid Google ID token");
            }

            // Ensure the email has been verified by Google
            if (!Boolean.parseBoolean(String.valueOf(payload.get("email_verified")))) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Google account email is not verified");
            }

            return payload;

        } catch (ResponseStatusException e) {
            throw e;
        } catch (RestClientException e) {
            // Google returned a 4xx (invalid token) or the service was unreachable
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Google ID token verification failed: " + e.getMessage());
        }
    }
}

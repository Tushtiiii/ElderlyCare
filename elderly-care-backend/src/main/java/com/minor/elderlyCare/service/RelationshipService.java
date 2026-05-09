package com.minor.elderlyCare.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minor.elderlyCare.dto.request.RelationshipCodeRequest;
import com.minor.elderlyCare.dto.request.RelationshipRequest;
import com.minor.elderlyCare.dto.response.RelationshipResponse;
import com.minor.elderlyCare.exception.ResourceNotFoundException;
import com.minor.elderlyCare.model.ElderChildRelationship;
import com.minor.elderlyCare.model.RelationshipStatus;
import com.minor.elderlyCare.model.Role;
import com.minor.elderlyCare.model.User;
import com.minor.elderlyCare.repository.ElderChildRelationshipRepository;
import com.minor.elderlyCare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RelationshipService {

    private final UserRepository                   userRepository;
    private final ElderChildRelationshipRepository relationshipRepository;
    private final ElderAccessService               elderAccessService;

    // ── Create a monitoring connection ───────────────────────────────────────

    @Transactional
    public RelationshipResponse requestRelationship(UUID currentUserId,
                                                     RelationshipRequest req) {

        User currentUser = loadActiveUser(currentUserId);
        User targetUser  = userRepository
                .findByEmailIgnoreCase(req.getTargetEmail())
                .filter(User::isActive)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No active user found with email: " + req.getTargetEmail()));

        // Cannot connect with yourself
        if (currentUser.getId().equals(targetUser.getId())) {
                throw new IllegalStateException(
                    "You cannot create a monitoring connection with yourself.");
        }

        // Exactly one participant must be an ELDER; the other is a viewer
        // (CHILD / DOCTOR / PATHOLOGIST).
        boolean currentIsElder = currentUser.getRole() == Role.ELDER;
        boolean targetIsElder  = targetUser.getRole() == Role.ELDER;

        if (currentIsElder == targetIsElder) {
            // Either both elders or both non-elders → invalid pair
            throw new IllegalStateException(
                "A monitoring relationship must connect exactly one ELDER " +
                    "and one non-elder viewer (CHILD, DOCTOR, or PATHOLOGIST).");
        }

        // Resolve who is elder and who is viewer (stored in child column)
        User elder = currentIsElder ? currentUser : targetUser;
        User child = currentIsElder ? targetUser : currentUser;

        ElderChildRelationship existing = relationshipRepository
            .findByElderIdAndChildId(elder.getId(), child.getId())
            .orElse(null);

        if (existing != null) {
            if (existing.getStatus() == RelationshipStatus.REVOKED) {
            existing.setStatus(RelationshipStatus.ACTIVE);
            existing.setRequestedBy(currentUser);
            return RelationshipResponse.from(relationshipRepository.save(existing));
            }

            // Idempotent behavior: if already linked, return the existing relationship
            // instead of failing with 409.
            return RelationshipResponse.from(existing);
        }

        ElderChildRelationship relationship = ElderChildRelationship.builder()
                .elder(elder)
                .child(child)
                .requestedBy(currentUser)
                .status(RelationshipStatus.ACTIVE)
                .build();

        return RelationshipResponse.from(relationshipRepository.save(relationship));
    }

    /**
     * Create a relationship using an elder's care code (their UUID string).
     * Intended for non-elder roles (CHILD / DOCTOR / PATHOLOGIST) to
     * connect to an elder without any approval step.
     */
    @Transactional
    public RelationshipResponse requestRelationshipByCode(UUID currentUserId,
                                                          RelationshipCodeRequest req) {

        User currentUser = loadActiveUser(currentUserId);

        UUID elderUuid;
        try {
            elderUuid = UUID.fromString(req.getElderCode().trim());
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("Invalid care code.");
        }

        User elder = userRepository.findByIdAndIsActiveTrue(elderUuid)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No active elder found for the given care code."));

        if (elder.getRole() != Role.ELDER) {
            throw new IllegalStateException("Care code must belong to an ELDER account.");
        }

        if (currentUser.getRole() == Role.ELDER) {
            throw new IllegalStateException(
                    "Elders should share their care code; guardians/doctors/pathologists " +
                    "use it to connect.");
        }

        ElderChildRelationship existing = relationshipRepository
            .findByElderIdAndChildId(elder.getId(), currentUser.getId())
            .orElse(null);

        if (existing != null) {
            if (existing.getStatus() == RelationshipStatus.REVOKED) {
            existing.setStatus(RelationshipStatus.ACTIVE);
            existing.setRequestedBy(currentUser);
            return RelationshipResponse.from(relationshipRepository.save(existing));
            }

            // Idempotent behavior: if already linked, return the existing relationship
            // instead of failing with 409.
            return RelationshipResponse.from(existing);
        }

        ElderChildRelationship relationship = ElderChildRelationship.builder()
                .elder(elder)
                .child(currentUser)
                .requestedBy(currentUser)
                .status(RelationshipStatus.ACTIVE)
                .build();

        return RelationshipResponse.from(relationshipRepository.save(relationship));
    }

    // ── Accept endpoint is retained for compatibility ────────────────────────

    @Transactional
    public RelationshipResponse acceptRelationship(UUID currentUserId, UUID relationshipId) {
        ElderChildRelationship relationship = loadRelationship(relationshipId);

        ensureParticipant(currentUserId, relationship);

        if (relationship.getStatus() == RelationshipStatus.REVOKED) {
            throw new IllegalStateException(
                "Revoked relationships cannot be accepted.");
        }

        relationship.setStatus(RelationshipStatus.ACTIVE);
        return RelationshipResponse.from(relationshipRepository.save(relationship));
    }

    // ── Revoke an ACTIVE or PENDING relationship ──────────────────────────────

    @Transactional
    public RelationshipResponse revokeRelationship(UUID currentUserId, UUID relationshipId) {
        ElderChildRelationship relationship = loadRelationship(relationshipId);

        ensureParticipant(currentUserId, relationship);

        if (relationship.getStatus() == RelationshipStatus.REVOKED) {
            throw new IllegalStateException("Relationship is already revoked.");
        }

        relationship.setStatus(RelationshipStatus.REVOKED);
        return RelationshipResponse.from(relationshipRepository.save(relationship));
    }

    // ── Read queries ──────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<RelationshipResponse> getMyChildren(UUID elderId) {
        return relationshipRepository
                .findByElderIdAndStatus(elderId, RelationshipStatus.ACTIVE)
                .stream()
                .map(RelationshipResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RelationshipResponse> getMyElders(UUID childId) {
        return relationshipRepository
                .findByChildIdAndStatus(childId, RelationshipStatus.ACTIVE)
                .stream()
                .map(RelationshipResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Returns all ACTIVE relationships for a given elder, after validating
     * that the caller has access to that elder via {@link ElderAccessService}.
     * This is used to show the full care team (guardians, doctors, pathologists)
     * to any linked participant.
     */
    @Transactional(readOnly = true)
    public List<RelationshipResponse> getElderNetwork(UUID elderId, User currentUser) {
        User elder = elderAccessService.validateAccessAndGetElder(elderId, currentUser);
        return relationshipRepository
                .findByElderIdAndStatus(elder.getId(), RelationshipStatus.ACTIVE)
                .stream()
                .map(RelationshipResponse::from)
                .collect(Collectors.toList());
    }

    // ── Pending-request queries are disabled (approval flow removed) ───────

    /**
     * Returns PENDING relationships where the given user is the recipient
     * (i.e. they did NOT send the request). These are "incoming" requests
     * the user should see as notifications they can accept or reject.
     */
    @Transactional(readOnly = true)
    public List<RelationshipResponse> getIncomingPendingRequests(UUID userId) {
        loadActiveUser(userId);
        return List.of();
    }

    /**
     * Returns PENDING relationships where the given user IS the requester.
     * These are "sent" requests, so the user can see their outgoing status.
     */
    @Transactional(readOnly = true)
    public List<RelationshipResponse> getSentPendingRequests(UUID userId) {
        loadActiveUser(userId);
        return List.of();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private User loadActiveUser(UUID userId) {
        return userRepository.findByIdAndIsActiveTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + userId));
    }

    private ElderChildRelationship loadRelationship(UUID id) {
        return relationshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Relationship not found: " + id));
    }

    private void ensureParticipant(UUID userId, ElderChildRelationship r) {
        boolean isElder = r.getElder().getId().equals(userId);
        boolean isChild = r.getChild().getId().equals(userId);
        if (!isElder && !isChild) {
            throw new IllegalStateException(
                    "You are not a participant in this relationship.");
        }
    }
}

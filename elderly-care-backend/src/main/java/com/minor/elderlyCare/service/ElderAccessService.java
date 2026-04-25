package com.minor.elderlyCare.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.minor.elderlyCare.exception.ResourceNotFoundException;
import com.minor.elderlyCare.model.RelationshipStatus;
import com.minor.elderlyCare.model.Role;
import com.minor.elderlyCare.model.User;
import com.minor.elderlyCare.repository.ElderChildRelationshipRepository;
import com.minor.elderlyCare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Shared service for validating that the current user has permission
 * to access an elder's medical data.
 *
 * Access rules:
 *   • The elder themselves  → always allowed.
 *   • A linked viewer (CHILD / DOCTOR / PATHOLOGIST) with an ACTIVE
 *     relationship to the elder → allowed.
 *   • Anyone else → denied.
 */
@Service
@RequiredArgsConstructor
public class ElderAccessService {

    private final UserRepository userRepository;
    private final ElderChildRelationshipRepository relationshipRepository;

    /**
     * Validates that {@code currentUser} can access data belonging to
     * the elder identified by {@code elderId}.
     *
     * @return the elder User entity (pre-fetched for convenience)
     * @throws ResourceNotFoundException if elderId does not exist
     * @throws AccessDeniedException     if the caller has no access
     */
    public User validateAccessAndGetElder(UUID elderId, User currentUser) {
        User elder = userRepository.findById(elderId)
                .filter(User::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Elder not found: " + elderId));

        if (elder.getRole() != Role.ELDER) {
            throw new IllegalStateException("User " + elderId + " is not an elder");
        }

        // Elder accessing their own data
        if (currentUser.getId().equals(elderId)) {
            return elder;
        }

        // Linked viewer (guardian/doctor/pathologist) with an ACTIVE relationship
        if (currentUser.getRole() == Role.CHILD
                || currentUser.getRole() == Role.DOCTOR
                || currentUser.getRole() == Role.PATHOLOGIST) {
            boolean hasAccess = relationshipRepository
                    .findByElderIdAndChildId(elderId, currentUser.getId())
                    .filter(r -> r.getStatus() == RelationshipStatus.ACTIVE)
                    .isPresent();

            if (hasAccess) {
                return elder;
            }
        }

        throw new AccessDeniedException(
            "You do not have permission to access this elder's data");
    }

    /**
     * Returns IDs of all CHILD users who have an ACTIVE relationship
     * with the given elder.  Used for sending alert notifications.
     */
    public List<User> getLinkedGuardians(UUID elderId) {
        return relationshipRepository
                .findByElderIdAndStatus(elderId, RelationshipStatus.ACTIVE)
                .stream()
                .map(r -> r.getChild())
                .collect(Collectors.toList());
    }
}

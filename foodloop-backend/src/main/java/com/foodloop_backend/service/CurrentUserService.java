package com.foodloop_backend.service;

import com.foodloop_backend.entity.User;
import com.foodloop_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName() == null) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found"));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getUserId();
    }

    public boolean isAdmin() {
        return isAdmin(getCurrentUser());
    }

    public boolean isAdmin(User user) {
        return "ADMIN".equals(user.getRole());
    }

    public void verifySelfOrAdmin(Long requestedUserId) {

        User currentUser = getCurrentUser();

        if (!isAdmin(currentUser) &&
                !currentUser.getUserId().equals(requestedUserId)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not authorized to access this user's data");
        }
    }
}

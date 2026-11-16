package com.foodloop_backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.foodloop_backend.entity.User;
import com.foodloop_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       CurrentUserService currentUserService,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    public User registerUser(User user) {
        if (user == null || user.getRole() == null ||
                !List.of("DONOR", "NGO", "VOLUNTEER").contains(user.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Choose a supported public account role: DONOR, NGO, or VOLUNTEER");
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email address is required");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already registered!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // NGOs require admin verification; donors and volunteers are active immediately
        user.setVerified(!"NGO".equalsIgnoreCase(user.getRole()));

        User savedUser = userRepository.save(user);

        if ("NGO".equalsIgnoreCase(savedUser.getRole())) {
            notificationService.createNotification(
                    savedUser.getUserId(),
                    "Welcome to FoodLoop",
                    "Your NGO account has been registered. You will be able to request food once an administrator verifies your account.",
                    "ACCOUNT_REGISTERED"
            );
        } else {
            notificationService.createNotification(
                    savedUser.getUserId(),
                    "Welcome to FoodLoop",
                    "Your " + savedUser.getRole().toLowerCase() + " account is active. Welcome to the FoodLoop platform!",
                    "ACCOUNT_REGISTERED"
            );
        }

        return savedUser;
    }

    public List<User> getAllUsers() {
        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can view all users");
        }
        return userRepository.findAll();
    }

    public List<User> getVolunteers() {
        return userRepository.findByRole("VOLUNTEER");
    }

    public Optional<User> getUserById(Long id) {
        currentUserService.verifySelfOrAdmin(id);
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        return user;
    }

    public User verifyUser(Long id) {
        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can verify users");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"));

        user.setVerified(true);
        User saved = userRepository.save(user);

        notificationService.createNotification(
                user.getUserId(),
                "Account Verified",
                "Your organization account has been successfully verified by an administrator! You can now request surplus food donations.",
                "ACCOUNT_VERIFIED"
        );

        return saved;
    }

    public User toggleVerification(Long id) {
        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can update user verification status");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"));

        boolean newStatus = !Boolean.TRUE.equals(user.getVerified());
        user.setVerified(newStatus);
        User saved = userRepository.save(user);

        if (newStatus) {
            notificationService.createNotification(
                    user.getUserId(),
                    "Account Verified",
                    "Your account has been verified by the administrator.",
                    "ACCOUNT_VERIFIED"
            );
        }

        return saved;
    }

    public void deleteUser(Long id) {
        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can delete users");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"));

        userRepository.delete(user);
    }
}

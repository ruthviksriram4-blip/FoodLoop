package com.foodloop_backend.controller;

import com.foodloop_backend.config.JwtService;
import com.foodloop_backend.dto.LoginRequest;
import com.foodloop_backend.dto.LoginResponse;
import com.foodloop_backend.dto.UserResponse;
import com.foodloop_backend.entity.User;
import com.foodloop_backend.service.CurrentUserService;
import com.foodloop_backend.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final CurrentUserService currentUserService;

    public UserController(
            UserService userService,
            JwtService jwtService,
            CurrentUserService currentUserService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.currentUserService = currentUserService;
    }

    private UserResponse convertToResponse(User user) {
        return new UserResponse(
            user.getUserId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole(),
            user.getOrganizationName(),
            user.getAddress(),
            user.getVerified()
        );
    }

    @PostMapping("/register")
    public UserResponse registerUser(@RequestBody User user) {
        return convertToResponse(userService.registerUser(user));
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @GetMapping("/volunteers")
    public List<UserResponse> getVolunteers() {
        return userService.getVolunteers()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @GetMapping("/profile")
    public UserResponse getProfile() {
        return convertToResponse(currentUserService.getCurrentUser());
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));

        return convertToResponse(user);
    }

    @PutMapping("/{id}/verify")
    public UserResponse verifyUser(@PathVariable Long id) {
        return convertToResponse(userService.verifyUser(id));
    }

    @PutMapping("/{id}/toggle-status")
    public UserResponse toggleUserStatus(@PathVariable Long id) {
        return convertToResponse(userService.toggleVerification(id));
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully!";
    }

    @PostMapping("/login")
    public LoginResponse loginUser(@RequestBody LoginRequest request) {

        User user = userService.loginUser(
            request.getEmail(),
            request.getPassword()
        );

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
            token,
            convertToResponse(user)
        );
    }
}

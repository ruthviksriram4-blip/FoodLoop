package com.foodloop_backend.controller;

import com.foodloop_backend.config.JwtService;
import com.foodloop_backend.dto.LoginRequest;
import com.foodloop_backend.dto.LoginResponse;
import com.foodloop_backend.dto.UserResponse;
import com.foodloop_backend.entity.User;
import com.foodloop_backend.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
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

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {

        User user = userService.getUserById(id)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));

        return convertToResponse(user);
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
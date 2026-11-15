
package com.foodloop_backend.service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.foodloop_backend.entity.User;
import com.foodloop_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       CurrentUserService currentUserService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.currentUserService = currentUserService;
    }

   public User registerUser(User user) {
    if (user == null || user.getRole() == null ||
            !List.of("DONOR", "NGO", "VOLUNTEER").contains(user.getRole())) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Choose a supported public account role");
    }

    if (userRepository.existsByEmail(user.getEmail())) {
        throw new RuntimeException("Email already registered!");
    }

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setVerified(false);

    return userRepository.save(user);
}

    public List<User> getAllUsers() {
        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can view all users");
        }
        return userRepository.findAll();
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
}

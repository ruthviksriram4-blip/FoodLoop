package com.foodloop_backend.controller;

import com.foodloop_backend.dto.AdminReportResponse;
import com.foodloop_backend.dto.UserResponse;
import com.foodloop_backend.entity.User;
import com.foodloop_backend.repository.*;
import com.foodloop_backend.service.CurrentUserService;
import com.foodloop_backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final FoodDonationRepository donationRepository;
    private final DonationRequestRepository requestRepository;
    private final VolunteerAssignmentRepository assignmentRepository;
    private final UserService userService;
    private final CurrentUserService currentUserService;

    public AdminController(
            UserRepository userRepository,
            FoodDonationRepository donationRepository,
            DonationRequestRepository requestRepository,
            VolunteerAssignmentRepository assignmentRepository,
            UserService userService,
            CurrentUserService currentUserService) {

        this.userRepository = userRepository;
        this.donationRepository = donationRepository;
        this.requestRepository = requestRepository;
        this.assignmentRepository = assignmentRepository;
        this.userService = userService;
        this.currentUserService = currentUserService;
    }

    private void verifyAdmin() {
        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access restricted to administrators");
        }
    }

    @GetMapping("/reports")
    public AdminReportResponse getReports() {
        verifyAdmin();

        AdminReportResponse report = new AdminReportResponse();

        var users = userRepository.findAll();
        report.setTotalUsers(users.size());
        report.setTotalDonors(users.stream().filter(u -> "DONOR".equals(u.getRole())).count());
        var ngos = users.stream().filter(u -> "NGO".equals(u.getRole())).toList();
        report.setTotalNgos(ngos.size());
        report.setVerifiedNgos(ngos.stream().filter(u -> Boolean.TRUE.equals(u.getVerified())).count());
        report.setPendingNgos(ngos.stream().filter(u -> !Boolean.TRUE.equals(u.getVerified())).count());
        report.setTotalVolunteers(users.stream().filter(u -> "VOLUNTEER".equals(u.getRole())).count());

        var donations = donationRepository.findAll();
        report.setTotalDonations(donations.size());
        report.setAvailableDonations(donations.stream().filter(d -> "AVAILABLE".equals(d.getStatus())).count());
        report.setAcceptedDonations(donations.stream().filter(d -> "ACCEPTED".equals(d.getStatus())).count());
        report.setDeliveredDonations(donations.stream().filter(d -> "DELIVERED".equals(d.getStatus())).count());
        report.setExpiredDonations(donations.stream().filter(d -> "EXPIRED".equals(d.getStatus())).count());

        var requests = requestRepository.findAll();
        report.setTotalRequests(requests.size());
        report.setPendingRequests(requests.stream().filter(r -> "PENDING".equals(r.getStatus())).count());
        report.setAcceptedRequests(requests.stream().filter(r -> "ACCEPTED".equals(r.getStatus())).count());
        report.setRejectedRequests(requests.stream().filter(r -> "REJECTED".equals(r.getStatus())).count());

        var assignments = assignmentRepository.findAll();
        report.setTotalAssignments(assignments.size());
        report.setPendingPickups(assignments.stream().filter(a -> "PENDING".equals(a.getPickupStatus())).count());
        report.setCollectedPickups(assignments.stream().filter(a -> "COLLECTED".equals(a.getPickupStatus()) && !"DELIVERED".equals(a.getDeliveryStatus())).count());
        report.setCompletedDeliveries(assignments.stream().filter(a -> "DELIVERED".equals(a.getDeliveryStatus())).count());

        return report;
    }

    @PutMapping("/ngos/{id}/verify")
    public UserResponse verifyNgo(@PathVariable Long id) {
        verifyAdmin();
        User user = userService.verifyUser(id);
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

    @PutMapping("/users/{id}/status")
    public UserResponse updateUserStatus(@PathVariable Long id) {
        verifyAdmin();
        User user = userService.toggleVerification(id);
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
}

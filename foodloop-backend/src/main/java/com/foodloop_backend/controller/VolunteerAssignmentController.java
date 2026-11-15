package com.foodloop_backend.controller;

import com.foodloop_backend.dto.VolunteerAssignmentRequest;
import com.foodloop_backend.dto.VolunteerAssignmentResponse;
import com.foodloop_backend.service.VolunteerAssignmentService;
import com.foodloop_backend.service.CurrentUserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class VolunteerAssignmentController {

    private final VolunteerAssignmentService assignmentService;
    private final CurrentUserService currentUserService;

    public VolunteerAssignmentController(
            VolunteerAssignmentService assignmentService,
            CurrentUserService currentUserService) {
        this.assignmentService = assignmentService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public ResponseEntity<VolunteerAssignmentResponse> assignVolunteer(
            @RequestBody VolunteerAssignmentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                assignmentService.assignVolunteer(
                        currentUserService.getCurrentUserId(), request));
    }

    @GetMapping
    public ResponseEntity<List<VolunteerAssignmentResponse>> getAllAssignments() {

        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can view all assignments");
        }

        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<VolunteerAssignmentResponse>>
            getAssignmentsByVolunteer(@PathVariable Long volunteerId) {

        Long currentId = currentUserService.getCurrentUserId();

        if (!currentUserService.isAdmin() && !currentId.equals(volunteerId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot view another volunteer's assignments");
        }

        return ResponseEntity.ok(
                assignmentService.getAssignmentsByVolunteer(volunteerId));
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<VolunteerAssignmentResponse> getAssignmentById(
            @PathVariable Long assignmentId) {

        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can access an assignment by ID");
        }

        return ResponseEntity.ok(
                assignmentService.getAssignmentById(assignmentId));
    }

    @PutMapping("/{assignmentId}/collect")
    public ResponseEntity<VolunteerAssignmentResponse> markCollected(
            @PathVariable Long assignmentId) {

        return ResponseEntity.ok(
                assignmentService.markCollected(
                        assignmentId,
                        currentUserService.getCurrentUserId()));
    }

    @PutMapping("/{assignmentId}/deliver")
    public ResponseEntity<VolunteerAssignmentResponse> markDelivered(
            @PathVariable Long assignmentId) {

        return ResponseEntity.ok(
                assignmentService.markDelivered(
                        assignmentId,
                        currentUserService.getCurrentUserId()));
    }
}
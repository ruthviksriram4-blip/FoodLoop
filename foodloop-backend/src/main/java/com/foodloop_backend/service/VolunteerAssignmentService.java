
package com.foodloop_backend.service;

import com.foodloop_backend.dto.VolunteerAssignmentRequest;
import com.foodloop_backend.dto.VolunteerAssignmentResponse;
import com.foodloop_backend.entity.DonationRequest;
import com.foodloop_backend.entity.FoodDonation;
import com.foodloop_backend.entity.User;
import com.foodloop_backend.entity.VolunteerAssignment;
import com.foodloop_backend.repository.DonationRequestRepository;
import com.foodloop_backend.repository.FoodDonationRepository;
import com.foodloop_backend.repository.UserRepository;
import com.foodloop_backend.repository.VolunteerAssignmentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class VolunteerAssignmentService {

    private final VolunteerAssignmentRepository assignmentRepository;
    private final DonationRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final FoodDonationRepository donationRepository;
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    public VolunteerAssignmentService(
            VolunteerAssignmentRepository assignmentRepository,
            DonationRequestRepository requestRepository,
            UserRepository userRepository,
            FoodDonationRepository donationRepository,
            NotificationService notificationService,
            CurrentUserService currentUserService) {

        this.assignmentRepository = assignmentRepository;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.donationRepository = donationRepository;
        this.notificationService = notificationService;
        this.currentUserService = currentUserService;
    }

    private VolunteerAssignmentResponse convertToResponse(
            VolunteerAssignment assignment) {

        DonationRequest request = assignment.getRequest();

        return new VolunteerAssignmentResponse(
                assignment.getAssignmentId(),
                request.getRequestId(),
                request.getDonation().getDonationId(),
                request.getDonation().getFoodName(),
                assignment.getVolunteer().getUserId(),
                assignment.getVolunteer().getName(),
                assignment.getPickupTime(),
                assignment.getDeliveryTime(),
                assignment.getPickupStatus(),
                assignment.getDeliveryStatus(),
                assignment.getAssignedAt()
        );
    }

    public VolunteerAssignmentResponse assignVolunteer(
            Long donorId,
            VolunteerAssignmentRequest requestData) {

        User authenticated = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin() && !"DONOR".equals(authenticated.getRole())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only donors can assign volunteers");

        if (donorId == null || requestData == null
                || requestData.getRequestId() == null
                || requestData.getVolunteerId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Donor ID, request ID and volunteer ID are required");
        }

        DonationRequest donationRequest = requestRepository
                .findById(requestData.getRequestId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Donation request not found"));

        User volunteer = userRepository
                .findById(requestData.getVolunteerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Volunteer not found"));

        FoodDonation donation = donationRequest.getDonation();

        if (!currentUserService.isAdmin() && !donation.getDonor().getUserId().equals(authenticated.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not authorized to assign this request");
        }

        if (!"VOLUNTEER".equals(volunteer.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selected user is not a volunteer");
        }

        if (!"ACCEPTED".equals(donationRequest.getStatus())
                || !"ACCEPTED".equals(donation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only accepted donation requests can be assigned");
        }

        if (assignmentRepository.existsByRequest_RequestId(
                donationRequest.getRequestId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A volunteer is already assigned to this request");
        }

        VolunteerAssignment assignment = new VolunteerAssignment();

        assignment.setRequest(donationRequest);
        assignment.setVolunteer(volunteer);
        assignment.setPickupStatus("PENDING");
        assignment.setDeliveryStatus("PENDING");

        VolunteerAssignment saved =
                assignmentRepository.save(assignment);

        notificationService.createNotification(
                volunteer.getUserId(),
                "New Volunteer Assignment",
                "You have been assigned to collect and deliver "
                        + donation.getFoodName(),
                "VOLUNTEER_ASSIGNED"
        );

        return convertToResponse(saved);
    }

    public List<VolunteerAssignmentResponse> getAllAssignments() {

        if (!currentUserService.isAdmin()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can view all assignments");

        return assignmentRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<VolunteerAssignmentResponse> getAssignmentsByVolunteer(
            Long volunteerId) {

        User current = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin() && (!"VOLUNTEER".equals(current.getRole()) || !current.getUserId().equals(volunteerId))) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view another volunteer's assignments");

        return assignmentRepository
                .findByVolunteer_UserId(currentUserService.isAdmin() ? volunteerId : current.getUserId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public VolunteerAssignmentResponse getAssignmentById(
            Long assignmentId) {

        if (!currentUserService.isAdmin()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can access an assignment by ID");

        return convertToResponse(getAssignmentEntity(assignmentId));
    }

    public VolunteerAssignmentResponse markCollected(
            Long assignmentId, Long volunteerId) {

        VolunteerAssignment assignment =
                getAssignmentEntity(assignmentId);

        verifyVolunteer(assignment);

        if (!"PENDING".equals(assignment.getPickupStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Food has already been collected");
        }

        if (!"PENDING".equals(assignment.getDeliveryStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid assignment status");
        }

        assignment.setPickupStatus("COLLECTED");
        assignment.setPickupTime(LocalDateTime.now());

        VolunteerAssignment saved =
                assignmentRepository.save(assignment);

        DonationRequest request = assignment.getRequest();
        FoodDonation donation = request.getDonation();

        notificationService.createNotification(
                donation.getDonor().getUserId(),
                "Food Collected",
                "The volunteer has collected "
                        + donation.getFoodName(),
                "FOOD_COLLECTED"
        );

        notificationService.createNotification(
                request.getNgo().getUserId(),
                "Food Collected",
                "The volunteer has collected "
                        + donation.getFoodName()
                        + " for your request.",
                "FOOD_COLLECTED"
        );

        return convertToResponse(saved);
    }

    public VolunteerAssignmentResponse markDelivered(
            Long assignmentId, Long volunteerId) {

        VolunteerAssignment assignment =
                getAssignmentEntity(assignmentId);

        verifyVolunteer(assignment);

        if (!"COLLECTED".equals(assignment.getPickupStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Food must be collected before delivery");
        }

        if (!"PENDING".equals(assignment.getDeliveryStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Food has already been delivered");
        }

        assignment.setDeliveryStatus("DELIVERED");
        assignment.setDeliveryTime(LocalDateTime.now());

        DonationRequest request = assignment.getRequest();
        FoodDonation donation = request.getDonation();

        donation.setStatus("DELIVERED");
        donationRepository.save(donation);

        VolunteerAssignment saved =
                assignmentRepository.save(assignment);

        notificationService.createNotification(
                donation.getDonor().getUserId(),
                "Food Delivered",
                donation.getFoodName()
                        + " has been successfully delivered.",
                "FOOD_DELIVERED"
        );

        notificationService.createNotification(
                request.getNgo().getUserId(),
                "Food Delivered",
                donation.getFoodName()
                        + " has been successfully delivered to your NGO.",
                "FOOD_DELIVERED"
        );

        return convertToResponse(saved);
    }

    private VolunteerAssignment getAssignmentEntity(
            Long assignmentId) {

        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Volunteer assignment not found"));
    }

    private void verifyVolunteer(VolunteerAssignment assignment) {

        User current = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin() && (!"VOLUNTEER".equals(current.getRole()) || !assignment.getVolunteer().getUserId().equals(current.getUserId()))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not authorized to update this assignment");
        }
    }
}

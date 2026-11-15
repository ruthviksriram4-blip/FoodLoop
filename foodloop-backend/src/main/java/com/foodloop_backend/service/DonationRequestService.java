
package com.foodloop_backend.service;

import com.foodloop_backend.dto.DonationRequestRequest;
import com.foodloop_backend.dto.DonationRequestResponse;
import com.foodloop_backend.entity.DonationRequest;
import com.foodloop_backend.entity.FoodDonation;
import com.foodloop_backend.entity.User;
import com.foodloop_backend.repository.DonationRequestRepository;
import com.foodloop_backend.repository.FoodDonationRepository;
import com.foodloop_backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DonationRequestService {

    private final DonationRequestRepository requestRepository;
    private final FoodDonationRepository donationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    public DonationRequestService(
            DonationRequestRepository requestRepository,
            FoodDonationRepository donationRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            CurrentUserService currentUserService) {

        this.requestRepository = requestRepository;
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.currentUserService = currentUserService;
    }

    // Convert entity to response
    private DonationRequestResponse convertToResponse(
            DonationRequest request) {

        return new DonationRequestResponse(
                request.getRequestId(),
                request.getDonation().getDonationId(),
                request.getDonation().getFoodName(),
                request.getNgo().getUserId(),
                request.getNgo().getName(),
                request.getRequestMessage(),
                request.getRequestedQuantity(),
                request.getStatus(),
                request.getRequestedAt()
        );
    }

    // Create NGO food request
    public DonationRequestResponse createRequest(
            Long ngoId,
            DonationRequestRequest requestData) {

        User authenticated = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin() && !"NGO".equals(authenticated.getRole())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only NGOs can request food donations");

        if (requestData == null ||
                requestData.getDonationId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Donation ID is required");
        }

        User ngo = currentUserService.isAdmin() && ngoId != null
                ? userRepository.findById(ngoId).orElse(authenticated) : authenticated;
        /* User ngo = userRepository.findById(ngoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "NGO not found")); */

        if (!"NGO".equals(ngo.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only NGOs can request food donations");
        }

        FoodDonation donation = donationRepository
                .findById(requestData.getDonationId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Donation not found"));

        if (!"AVAILABLE".equals(donation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This donation is not available");
        }

        if (donation.getExpiryTime() == null ||
                !donation.getExpiryTime().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This food donation has expired");
        }

        Integer quantity = requestData.getRequestedQuantity();

        if (quantity == null || quantity <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Requested quantity must be greater than zero");
        }

        if (quantity > donation.getQuantity()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Requested quantity exceeds available food quantity");
        }

        boolean duplicateRequest = requestRepository
                .existsByDonation_DonationIdAndNgo_UserIdAndStatusIn(
                        donation.getDonationId(),
                        ngoId,
                        List.of("PENDING", "ACCEPTED")
                );

        if (duplicateRequest) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You already have a pending or accepted request for this donation");
        }

        if (donation.getDonor().getUserId().equals(ngoId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot request your own donation");
        }

        DonationRequest request = new DonationRequest();

        request.setDonation(donation);
        request.setNgo(ngo);
        request.setRequestMessage(requestData.getRequestMessage());
        request.setRequestedQuantity(quantity);
        request.setStatus("PENDING");

        DonationRequest savedRequest =
                requestRepository.save(request);

        notificationService.createNotification(
                donation.getDonor().getUserId(),
                "New Food Request",
                ngo.getName() + " requested "
                        + quantity + " units of "
                        + donation.getFoodName(),
                "REQUEST_RECEIVED"
        );

        return convertToResponse(savedRequest);
    }

    // Get all requests
    public List<DonationRequestResponse> getAllRequests() {
        if (!currentUserService.isAdmin()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can view all requests");

        return requestRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get requests by NGO
    public List<DonationRequestResponse> getRequestsByNgo(
            Long ngoId) {
        User current = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin() && (!"NGO".equals(current.getRole()) || !current.getUserId().equals(ngoId))) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view another NGO's requests");
        return requestRepository.findByNgo_UserId(currentUserService.isAdmin() ? ngoId : current.getUserId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get requests by donor
    public List<DonationRequestResponse> getRequestsByDonor(
            Long donorId) {

        User current = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin() && (!"DONOR".equals(current.getRole()) || !current.getUserId().equals(donorId))) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view another donor's requests");

        return requestRepository
                .findByDonation_Donor_UserId(currentUserService.isAdmin() ? donorId : current.getUserId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get request by ID
    public DonationRequestResponse getRequestById(
            Long requestId) {

        return convertToResponse(getRequestEntity(requestId));
    }

    // Accept NGO request
    public DonationRequestResponse acceptRequest(
            Long requestId, Long donorId) {

        DonationRequest request = getRequestEntity(requestId);

        if (!currentUserService.isAdmin() && (!"DONOR".equals(currentUserService.getCurrentUser().getRole()) || !request.getDonation().getDonor().getUserId().equals(currentUserService.getCurrentUserId()))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot manage this donation request");
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending requests can be accepted");
        }

        FoodDonation donation = request.getDonation();

        if (!"AVAILABLE".equals(donation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Donation is no longer available");
        }

        if (donation.getExpiryTime() == null ||
                !donation.getExpiryTime().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Food donation has expired");
        }

        // Accept selected request
        request.setStatus("ACCEPTED");
        donation.setStatus("ACCEPTED");

        DonationRequest savedRequest =
                requestRepository.save(request);

        notificationService.createNotification(
                request.getNgo().getUserId(),
                "Food Request Accepted",
                "Your request for "
                        + donation.getFoodName()
                        + " has been accepted by the donor.",
                "REQUEST_ACCEPTED"
        );

        // Reject other pending requests
        List<DonationRequest> otherRequests =
                requestRepository.findByDonation_DonationId(
                        donation.getDonationId());

        for (DonationRequest otherRequest : otherRequests) {

            if (!otherRequest.getRequestId().equals(requestId)
                    && "PENDING".equals(otherRequest.getStatus())) {

                otherRequest.setStatus("REJECTED");

                requestRepository.save(otherRequest);

                notificationService.createNotification(
                        otherRequest.getNgo().getUserId(),
                        "Food Request Rejected",
                        "Your request for "
                                + donation.getFoodName()
                                + " was rejected because the donation "
                                + "was accepted by another NGO.",
                        "REQUEST_REJECTED"
                );
            }
        }

        return convertToResponse(savedRequest);
    }

    // Reject NGO request
    public DonationRequestResponse rejectRequest(
            Long requestId, Long donorId) {

        DonationRequest request = getRequestEntity(requestId);

        if (!currentUserService.isAdmin() && (!"DONOR".equals(currentUserService.getCurrentUser().getRole()) || !request.getDonation().getDonor().getUserId().equals(currentUserService.getCurrentUserId()))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot manage this donation request");
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending requests can be rejected");
        }

        request.setStatus("REJECTED");

        DonationRequest savedRequest =
                requestRepository.save(request);

        notificationService.createNotification(
                request.getNgo().getUserId(),
                "Food Request Rejected",
                "Your request for "
                        + request.getDonation().getFoodName()
                        + " has been rejected by the donor.",
                "REQUEST_REJECTED"
        );

        return convertToResponse(savedRequest);
    }

    // Cancel NGO request
    public DonationRequestResponse cancelRequest(
            Long requestId, Long ngoId) {

        DonationRequest request = getRequestEntity(requestId);

        if (!currentUserService.isAdmin() && (!"NGO".equals(currentUserService.getCurrentUser().getRole()) || !request.getNgo().getUserId().equals(currentUserService.getCurrentUserId()))) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot cancel this request");
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending requests can be cancelled");
        }

        request.setStatus("CANCELLED");

        DonationRequest savedRequest =
                requestRepository.save(request);

        notificationService.createNotification(
                request.getDonation().getDonor().getUserId(),
                "Food Request Cancelled",
                request.getNgo().getName()
                        + " cancelled the request for "
                        + request.getDonation().getFoodName(),
                "REQUEST_CANCELLED"
        );

        return convertToResponse(savedRequest);
    }

    // Find request entity
    private DonationRequest getRequestEntity(Long requestId) {

        return requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Donation request not found"));
    }
}

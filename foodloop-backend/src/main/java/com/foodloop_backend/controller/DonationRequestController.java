package com.foodloop_backend.controller;

import com.foodloop_backend.dto.DonationRequestRequest;
import com.foodloop_backend.dto.DonationRequestResponse;
import com.foodloop_backend.service.DonationRequestService;
import com.foodloop_backend.service.CurrentUserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class DonationRequestController {

    private final DonationRequestService requestService;
    private final CurrentUserService currentUserService;

    public DonationRequestController(
            DonationRequestService requestService,
            CurrentUserService currentUserService) {
        this.requestService = requestService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public DonationRequestResponse createRequest(
            @RequestBody DonationRequestRequest request) {

        return requestService.createRequest(
                currentUserService.getCurrentUserId(), request);
    }

    @GetMapping
    public List<DonationRequestResponse> getAllRequests() {

        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can view all requests");
        }

        return requestService.getAllRequests();
    }

    @GetMapping("/ngo/{ngoId}")
    public List<DonationRequestResponse> getRequestsByNgo(
            @PathVariable Long ngoId) {

        Long currentId = currentUserService.getCurrentUserId();

        if (!currentUserService.isAdmin() && !currentId.equals(ngoId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot view another NGO's requests");
        }

        return requestService.getRequestsByNgo(ngoId);
    }

    @GetMapping("/donor/{donorId}")
    public List<DonationRequestResponse> getRequestsByDonor(
            @PathVariable Long donorId) {

        Long currentId = currentUserService.getCurrentUserId();

        if (!currentUserService.isAdmin() && !currentId.equals(donorId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot view another donor's requests");
        }

        return requestService.getRequestsByDonor(donorId);
    }

    @GetMapping("/{requestId}")
    public DonationRequestResponse getRequestById(
            @PathVariable Long requestId) {

        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can access this endpoint");
        }

        return requestService.getRequestById(requestId);
    }

    @PutMapping("/{requestId}/accept")
    public DonationRequestResponse acceptRequest(
            @PathVariable Long requestId) {

        return requestService.acceptRequest(
                requestId, currentUserService.getCurrentUserId());
    }

    @PutMapping("/{requestId}/reject")
    public DonationRequestResponse rejectRequest(
            @PathVariable Long requestId) {

        return requestService.rejectRequest(
                requestId, currentUserService.getCurrentUserId());
    }

    @PutMapping("/{requestId}/cancel")
    public DonationRequestResponse cancelRequest(
            @PathVariable Long requestId) {

        return requestService.cancelRequest(
                requestId, currentUserService.getCurrentUserId());
    }
}
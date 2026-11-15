package com.foodloop_backend.controller;

import com.foodloop_backend.dto.FoodDonationResponse;
import com.foodloop_backend.entity.FoodDonation;
import com.foodloop_backend.service.FoodDonationService;
import com.foodloop_backend.service.CurrentUserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class FoodDonationController {

    private final FoodDonationService donationService;
    private final CurrentUserService currentUserService;

    public FoodDonationController(
            FoodDonationService donationService,
            CurrentUserService currentUserService) {
        this.donationService = donationService;
        this.currentUserService = currentUserService;
    }

    private FoodDonationResponse convertToResponse(FoodDonation donation) {
        return new FoodDonationResponse(
                donation.getDonationId(),
                donation.getDonor().getUserId(),
                donation.getDonor().getName(),
                donation.getFoodName(),
                donation.getFoodDescription(),
                donation.getFoodCategory(),
                donation.getQuantity(),
                donation.getQuantityUnit(),
                donation.getPreparedAt(),
                donation.getExpiryTime(),
                donation.getPickupAddress(),
                donation.getStatus(),
                donation.getCreatedAt()
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FoodDonationResponse addDonation(
            @RequestBody FoodDonation donation) {

        return convertToResponse(
                donationService.addDonation(
                        currentUserService.getCurrentUserId(), donation));
    }

    @GetMapping
    public List<FoodDonationResponse> getAllDonations() {
        return donationService.getAllDonations()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @GetMapping("/available")
    public List<FoodDonationResponse> getAvailableDonations() {
        return donationService.getAvailableDonations()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @GetMapping("/donor/{donorId}")
    public List<FoodDonationResponse> getDonationsByDonor(
            @PathVariable Long donorId) {

        Long currentId = currentUserService.getCurrentUserId();

        if (!currentUserService.isAdmin() &&
                !currentId.equals(donorId)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot view another donor's donations");
        }

        return donationService.getDonationsByDonor(donorId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @GetMapping("/{donationId}")
    public FoodDonationResponse getDonationById(
            @PathVariable Long donationId) {
        return convertToResponse(
                donationService.getDonationById(donationId));
    }

    @DeleteMapping("/{donationId}")
    public String deleteDonation(@PathVariable Long donationId) {

        donationService.deleteDonation(
                donationId,
                currentUserService.getCurrentUserId());

        return "Food donation deleted successfully!";
    }

    @PutMapping("/{donationId}")
    public FoodDonationResponse updateDonation(
            @PathVariable Long donationId,
            @RequestBody FoodDonation updatedDonation) {

        return convertToResponse(
                donationService.updateDonation(
                        donationId,
                        currentUserService.getCurrentUserId(),
                        updatedDonation));
    }
}

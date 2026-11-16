package com.foodloop_backend.service;

import com.foodloop_backend.entity.FoodDonation;
import com.foodloop_backend.entity.User;
import com.foodloop_backend.repository.FoodDonationRepository;
import com.foodloop_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class FoodDonationService {

    private final FoodDonationRepository donationRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public FoodDonationService(
            FoodDonationRepository donationRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService) {

        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    private void validateDonation(FoodDonation donation) {

        if (donation == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Donation details are required");
        }

        if (donation.getFoodName() == null ||
                donation.getFoodName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Food name is required");
        }

        if (donation.getQuantity() == null || donation.getQuantity() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity must be greater than zero");
        }

        if (donation.getFoodCategory() == null ||
                donation.getFoodCategory().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Food category is required");
        }

        if (donation.getQuantityUnit() == null ||
                donation.getQuantityUnit().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Quantity unit is required");
        }

        if (donation.getPickupAddress() == null ||
                donation.getPickupAddress().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Pickup address is required");
        }

        if (donation.getExpiryTime() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Expiry time is required");
        }

        if (!donation.getExpiryTime().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Food expiry time must be in the future");
        }

        if (donation.getPreparedAt() != null) {

            if (donation.getPreparedAt().isAfter(LocalDateTime.now())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Food preparation time cannot be in the future");
            }

            if (donation.getExpiryTime().isBefore(donation.getPreparedAt())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Expiry time must be after preparation time");
            }
        }
    }

    // Automatically check and update status of expired donations
    public void markExpiredDonations() {
        List<FoodDonation> availableList = donationRepository.findByStatus("AVAILABLE");
        LocalDateTime now = LocalDateTime.now();
        for (FoodDonation donation : availableList) {
            if (donation.getExpiryTime() != null && donation.getExpiryTime().isBefore(now)) {
                donation.setStatus("EXPIRED");
                donationRepository.save(donation);
            }
        }
    }

    public FoodDonation addDonation(Long donorId, FoodDonation donation) {

        User authenticated = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin() && !"DONOR".equals(authenticated.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only donors can add food donations");
        }

        User donor = currentUserService.isAdmin() && donorId != null
                ? userRepository.findById(donorId).orElse(authenticated)
                : authenticated;

        if (!"DONOR".equals(donor.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only donors can add food donations");
        }

        validateDonation(donation);

        donation.setDonor(donor);
        donation.setStatus("AVAILABLE");

        return donationRepository.save(donation);
    }

    public List<FoodDonation> getAllDonations() {
        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can view all donations");
        }
        markExpiredDonations();
        return donationRepository.findAll();
    }

    public List<FoodDonation> getAvailableDonations() {
        markExpiredDonations();
        return donationRepository.findByStatus("AVAILABLE");
    }

    public List<FoodDonation> getDonationsByDonor(Long donorId) {
        User current = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin() && !current.getUserId().equals(donorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view another donor's donations");
        }
        markExpiredDonations();
        return donationRepository.findByDonor_UserId(currentUserService.isAdmin() ? donorId : current.getUserId());
    }

    public FoodDonation getDonationById(Long donationId) {

        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Donation not found"));

        if ("AVAILABLE".equals(donation.getStatus()) &&
                donation.getExpiryTime() != null &&
                donation.getExpiryTime().isBefore(LocalDateTime.now())) {
            donation.setStatus("EXPIRED");
            donationRepository.save(donation);
        }

        User current = currentUserService.getCurrentUser();
        boolean isOwner = donation.getDonor().getUserId().equals(current.getUserId());
        boolean isAvailable = "AVAILABLE".equals(donation.getStatus());
        if (!currentUserService.isAdmin() && !isOwner && !isAvailable) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access this donation");
        }

        return donation;
    }

    public void deleteDonation(Long donationId, Long donorId) {

        FoodDonation donation = getDonationById(donationId);

        if (!currentUserService.isAdmin() && !donation.getDonor().getUserId().equals(currentUserService.getCurrentUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot delete another donor's donation");
        }

        if (!"AVAILABLE".equals(donation.getStatus()) && !"EXPIRED".equals(donation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only available or expired donations can be deleted");
        }

        donationRepository.delete(donation);
    }

    public FoodDonation updateDonation(
            Long donationId,
            Long donorId,
            FoodDonation updatedDonation) {

        FoodDonation existingDonation = getDonationById(donationId);

        if (!currentUserService.isAdmin() && !existingDonation.getDonor().getUserId().equals(currentUserService.getCurrentUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot update another donor's donation");
        }

        if (!"AVAILABLE".equals(existingDonation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only available donations can be updated");
        }

        validateDonation(updatedDonation);

        existingDonation.setFoodName(updatedDonation.getFoodName());
        existingDonation.setFoodDescription(updatedDonation.getFoodDescription());
        existingDonation.setFoodCategory(updatedDonation.getFoodCategory());
        existingDonation.setQuantity(updatedDonation.getQuantity());
        existingDonation.setQuantityUnit(updatedDonation.getQuantityUnit());
        existingDonation.setPreparedAt(updatedDonation.getPreparedAt());
        existingDonation.setExpiryTime(updatedDonation.getExpiryTime());
        existingDonation.setPickupAddress(updatedDonation.getPickupAddress());

        return donationRepository.save(existingDonation);
    }
}

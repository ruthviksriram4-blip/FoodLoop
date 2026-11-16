package com.foodloop_backend.dto;

import java.time.LocalDateTime;

public class VolunteerAssignmentResponse {

    private Long assignmentId;
    private Long requestId;
    private Long donationId;
    private String foodName;
    private String foodCategory;
    private Integer quantity;
    private String quantityUnit;
    private String pickupAddress;
    private Long donorId;
    private String donorName;
    private String donorPhone;
    private Long ngoId;
    private String ngoName;
    private String ngoPhone;
    private String ngoAddress;
    private Long volunteerId;
    private String volunteerName;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
    private String pickupStatus;
    private String deliveryStatus;
    private LocalDateTime assignedAt;

    public VolunteerAssignmentResponse() {
    }

    public VolunteerAssignmentResponse(
            Long assignmentId,
            Long requestId,
            Long donationId,
            String foodName,
            String foodCategory,
            Integer quantity,
            String quantityUnit,
            String pickupAddress,
            Long donorId,
            String donorName,
            String donorPhone,
            Long ngoId,
            String ngoName,
            String ngoPhone,
            String ngoAddress,
            Long volunteerId,
            String volunteerName,
            LocalDateTime pickupTime,
            LocalDateTime deliveryTime,
            String pickupStatus,
            String deliveryStatus,
            LocalDateTime assignedAt) {

        this.assignmentId = assignmentId;
        this.requestId = requestId;
        this.donationId = donationId;
        this.foodName = foodName;
        this.foodCategory = foodCategory;
        this.quantity = quantity;
        this.quantityUnit = quantityUnit;
        this.pickupAddress = pickupAddress;
        this.donorId = donorId;
        this.donorName = donorName;
        this.donorPhone = donorPhone;
        this.ngoId = ngoId;
        this.ngoName = ngoName;
        this.ngoPhone = ngoPhone;
        this.ngoAddress = ngoAddress;
        this.volunteerId = volunteerId;
        this.volunteerName = volunteerName;
        this.pickupTime = pickupTime;
        this.deliveryTime = deliveryTime;
        this.pickupStatus = pickupStatus;
        this.deliveryStatus = deliveryStatus;
        this.assignedAt = assignedAt;
    }

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Long getDonationId() { return donationId; }
    public void setDonationId(Long donationId) { this.donationId = donationId; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public String getFoodCategory() { return foodCategory; }
    public void setFoodCategory(String foodCategory) { this.foodCategory = foodCategory; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getQuantityUnit() { return quantityUnit; }
    public void setQuantityUnit(String quantityUnit) { this.quantityUnit = quantityUnit; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public Long getDonorId() { return donorId; }
    public void setDonorId(Long donorId) { this.donorId = donorId; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public Long getNgoId() { return ngoId; }
    public void setNgoId(Long ngoId) { this.ngoId = ngoId; }

    public String getNgoName() { return ngoName; }
    public void setNgoName(String ngoName) { this.ngoName = ngoName; }

    public String getNgoPhone() { return ngoPhone; }
    public void setNgoPhone(String ngoPhone) { this.ngoPhone = ngoPhone; }

    public String getNgoAddress() { return ngoAddress; }
    public void setNgoAddress(String ngoAddress) { this.ngoAddress = ngoAddress; }

    public Long getVolunteerId() { return volunteerId; }
    public void setVolunteerId(Long volunteerId) { this.volunteerId = volunteerId; }

    public String getVolunteerName() { return volunteerName; }
    public void setVolunteerName(String volunteerName) { this.volunteerName = volunteerName; }

    public LocalDateTime getPickupTime() { return pickupTime; }
    public void setPickupTime(LocalDateTime pickupTime) { this.pickupTime = pickupTime; }

    public LocalDateTime getDeliveryTime() { return deliveryTime; }
    public void setDeliveryTime(LocalDateTime deliveryTime) { this.deliveryTime = deliveryTime; }

    public String getPickupStatus() { return pickupStatus; }
    public void setPickupStatus(String pickupStatus) { this.pickupStatus = pickupStatus; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
}

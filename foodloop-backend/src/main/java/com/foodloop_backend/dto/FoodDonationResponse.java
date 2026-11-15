package com.foodloop_backend.dto;

import java.time.LocalDateTime;

public class FoodDonationResponse {

    private Long donationId;
    private Long donorId;
    private String donorName;
    private String foodName;
    private String foodDescription;
    private String foodCategory;
    private Integer quantity;
    private String quantityUnit;
    private LocalDateTime preparedAt;
    private LocalDateTime expiryTime;
    private String pickupAddress;
    private String status;
    private LocalDateTime createdAt;

    public FoodDonationResponse(
            Long donationId,
            Long donorId,
            String donorName,
            String foodName,
            String foodDescription,
            String foodCategory,
            Integer quantity,
            String quantityUnit,
            LocalDateTime preparedAt,
            LocalDateTime expiryTime,
            String pickupAddress,
            String status,
            LocalDateTime createdAt) {

        this.donationId = donationId;
        this.donorId = donorId;
        this.donorName = donorName;
        this.foodName = foodName;
        this.foodDescription = foodDescription;
        this.foodCategory = foodCategory;
        this.quantity = quantity;
        this.quantityUnit = quantityUnit;
        this.preparedAt = preparedAt;
        this.expiryTime = expiryTime;
        this.pickupAddress = pickupAddress;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getDonationId() { return donationId; }
    public Long getDonorId() { return donorId; }
    public String getDonorName() { return donorName; }
    public String getFoodName() { return foodName; }
    public String getFoodDescription() { return foodDescription; }
    public String getFoodCategory() { return foodCategory; }
    public Integer getQuantity() { return quantity; }
    public String getQuantityUnit() { return quantityUnit; }
    public LocalDateTime getPreparedAt() { return preparedAt; }
    public LocalDateTime getExpiryTime() { return expiryTime; }
    public String getPickupAddress() { return pickupAddress; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}


package com.foodloop_backend.dto;

import java.time.LocalDateTime;

public class VolunteerAssignmentResponse {

    private Long assignmentId;
    private Long requestId;
    private Long donationId;
    private String foodName;
    private Long volunteerId;
    private String volunteerName;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
    private String pickupStatus;
    private String deliveryStatus;
    private LocalDateTime assignedAt;

    public VolunteerAssignmentResponse(
            Long assignmentId,
            Long requestId,
            Long donationId,
            String foodName,
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
        this.volunteerId = volunteerId;
        this.volunteerName = volunteerName;
        this.pickupTime = pickupTime;
        this.deliveryTime = deliveryTime;
        this.pickupStatus = pickupStatus;
        this.deliveryStatus = deliveryStatus;
        this.assignedAt = assignedAt;
    }

    public Long getAssignmentId() { return assignmentId; }
    public Long getRequestId() { return requestId; }
    public Long getDonationId() { return donationId; }
    public String getFoodName() { return foodName; }
    public Long getVolunteerId() { return volunteerId; }
    public String getVolunteerName() { return volunteerName; }
    public LocalDateTime getPickupTime() { return pickupTime; }
    public LocalDateTime getDeliveryTime() { return deliveryTime; }
    public String getPickupStatus() { return pickupStatus; }
    public String getDeliveryStatus() { return deliveryStatus; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
}

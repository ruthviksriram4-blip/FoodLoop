
package com.foodloop_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_assignments")
public class VolunteerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Long assignmentId;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private DonationRequest request;

    @ManyToOne
    @JoinColumn(name = "volunteer_id", nullable = false)
    private User volunteer;

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Column(name = "delivery_time")
    private LocalDateTime deliveryTime;

    @Column(name = "pickup_status")
    private String pickupStatus = "PENDING";

    @Column(name = "delivery_status")
    private String deliveryStatus = "PENDING";

    @Column(name = "assigned_at", insertable = false, updatable = false)
    private LocalDateTime assignedAt;

    public Long getAssignmentId() {
        return assignmentId;
    }

    public DonationRequest getRequest() {
        return request;
    }

    public void setRequest(DonationRequest request) {
        this.request = request;
    }

    public User getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(User volunteer) {
        this.volunteer = volunteer;
    }

    public LocalDateTime getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(LocalDateTime pickupTime) {
        this.pickupTime = pickupTime;
    }

    public LocalDateTime getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(LocalDateTime deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public String getPickupStatus() {
        return pickupStatus;
    }

    public void setPickupStatus(String pickupStatus) {
        this.pickupStatus = pickupStatus;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
}

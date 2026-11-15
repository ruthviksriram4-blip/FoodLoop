
package com.foodloop_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_requests")
public class DonationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private FoodDonation donation;

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private User ngo;

    @Column(name = "request_message")
    private String requestMessage;

    @Column(name = "requested_quantity", nullable = false)
    private Integer requestedQuantity;

    @Column(name = "status")
    private String status = "PENDING";

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @PrePersist
    protected void onCreate() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "PENDING";
        }
    }

    public Long getRequestId() {
        return requestId;
    }

    public FoodDonation getDonation() {
        return donation;
    }

    public void setDonation(FoodDonation donation) {
        this.donation = donation;
    }

    public User getNgo() {
        return ngo;
    }

    public void setNgo(User ngo) {
        this.ngo = ngo;
    }

    public String getRequestMessage() {
        return requestMessage;
    }

    public void setRequestMessage(String requestMessage) {
        this.requestMessage = requestMessage;
    }

    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(Integer requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }
}

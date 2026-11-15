
package com.foodloop_backend.dto;

import java.time.LocalDateTime;

public class DonationRequestResponse {

    private Long requestId;
    private Long donationId;
    private String foodName;
    private Long ngoId;
    private String ngoName;
    private String requestMessage;
    private Integer requestedQuantity;
    private String status;
    private LocalDateTime requestedAt;

    public DonationRequestResponse(
            Long requestId,
            Long donationId,
            String foodName,
            Long ngoId,
            String ngoName,
            String requestMessage,
            Integer requestedQuantity,
            String status,
            LocalDateTime requestedAt) {

        this.requestId = requestId;
        this.donationId = donationId;
        this.foodName = foodName;
        this.ngoId = ngoId;
        this.ngoName = ngoName;
        this.requestMessage = requestMessage;
        this.requestedQuantity = requestedQuantity;
        this.status = status;
        this.requestedAt = requestedAt;
    }

    public Long getRequestId() {
        return requestId;
    }

    public Long getDonationId() {
        return donationId;
    }

    public String getFoodName() {
        return foodName;
    }

    public Long getNgoId() {
        return ngoId;
    }

    public String getNgoName() {
        return ngoName;
    }

    public String getRequestMessage() {
        return requestMessage;
    }

    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }
}

package com.foodloop_backend.dto;

public class AdminReportResponse {

    private long totalUsers;
    private long totalDonors;
    private long totalNgos;
    private long verifiedNgos;
    private long pendingNgos;
    private long totalVolunteers;

    private long totalDonations;
    private long availableDonations;
    private long acceptedDonations;
    private long deliveredDonations;
    private long expiredDonations;

    private long totalRequests;
    private long pendingRequests;
    private long acceptedRequests;
    private long rejectedRequests;

    private long totalAssignments;
    private long pendingPickups;
    private long collectedPickups;
    private long completedDeliveries;

    public AdminReportResponse() {
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalDonors() { return totalDonors; }
    public void setTotalDonors(long totalDonors) { this.totalDonors = totalDonors; }

    public long getTotalNgos() { return totalNgos; }
    public void setTotalNgos(long totalNgos) { this.totalNgos = totalNgos; }

    public long getVerifiedNgos() { return verifiedNgos; }
    public void setVerifiedNgos(long verifiedNgos) { this.verifiedNgos = verifiedNgos; }

    public long getPendingNgos() { return pendingNgos; }
    public void setPendingNgos(long pendingNgos) { this.pendingNgos = pendingNgos; }

    public long getTotalVolunteers() { return totalVolunteers; }
    public void setTotalVolunteers(long totalVolunteers) { this.totalVolunteers = totalVolunteers; }

    public long getTotalDonations() { return totalDonations; }
    public void setTotalDonations(long totalDonations) { this.totalDonations = totalDonations; }

    public long getAvailableDonations() { return availableDonations; }
    public void setAvailableDonations(long availableDonations) { this.availableDonations = availableDonations; }

    public long getAcceptedDonations() { return acceptedDonations; }
    public void setAcceptedDonations(long acceptedDonations) { this.acceptedDonations = acceptedDonations; }

    public long getDeliveredDonations() { return deliveredDonations; }
    public void setDeliveredDonations(long deliveredDonations) { this.deliveredDonations = deliveredDonations; }

    public long getExpiredDonations() { return expiredDonations; }
    public void setExpiredDonations(long expiredDonations) { this.expiredDonations = expiredDonations; }

    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }

    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }

    public long getAcceptedRequests() { return acceptedRequests; }
    public void setAcceptedRequests(long acceptedRequests) { this.acceptedRequests = acceptedRequests; }

    public long getRejectedRequests() { return rejectedRequests; }
    public void setRejectedRequests(long rejectedRequests) { this.rejectedRequests = rejectedRequests; }

    public long getTotalAssignments() { return totalAssignments; }
    public void setTotalAssignments(long totalAssignments) { this.totalAssignments = totalAssignments; }

    public long getPendingPickups() { return pendingPickups; }
    public void setPendingPickups(long pendingPickups) { this.pendingPickups = pendingPickups; }

    public long getCollectedPickups() { return collectedPickups; }
    public void setCollectedPickups(long collectedPickups) { this.collectedPickups = collectedPickups; }

    public long getCompletedDeliveries() { return completedDeliveries; }
    public void setCompletedDeliveries(long completedDeliveries) { this.completedDeliveries = completedDeliveries; }
}

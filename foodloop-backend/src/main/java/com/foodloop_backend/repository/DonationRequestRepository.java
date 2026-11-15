
package com.foodloop_backend.repository;

import com.foodloop_backend.entity.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRequestRepository
        extends JpaRepository<DonationRequest, Long> {

    List<DonationRequest> findByNgo_UserId(Long ngoId);

    List<DonationRequest> findByDonation_Donor_UserId(Long donorId);

    List<DonationRequest> findByDonation_DonationId(Long donationId);

    boolean existsByDonation_DonationIdAndNgo_UserIdAndStatusIn(
            Long donationId,
            Long ngoId,
            List<String> statuses
    );
}

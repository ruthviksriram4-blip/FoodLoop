package com.foodloop_backend.repository;

import com.foodloop_backend.entity.FoodDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {

    List<FoodDonation> findByStatus(String status);

    List<FoodDonation> findByDonor_UserId(Long donorId);
}

package com.foodloop_backend.repository;

import com.foodloop_backend.entity.VolunteerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VolunteerAssignmentRepository
        extends JpaRepository<VolunteerAssignment, Long> {

    List<VolunteerAssignment> findByVolunteer_UserId(Long volunteerId);

    boolean existsByRequest_RequestId(Long requestId);
}

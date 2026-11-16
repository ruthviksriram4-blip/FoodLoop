package com.foodloop_backend.config;

import com.foodloop_backend.entity.*;
import com.foodloop_backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FoodDonationRepository donationRepository;
    private final DonationRequestRepository requestRepository;
    private final VolunteerAssignmentRepository assignmentRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            FoodDonationRepository donationRepository,
            DonationRequestRepository requestRepository,
            VolunteerAssignmentRepository assignmentRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.donationRepository = donationRepository;
        this.requestRepository = requestRepository;
        this.assignmentRepository = assignmentRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Admin
        User admin = new User();
        admin.setName("System Administrator");
        admin.setEmail("admin@foodloop.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRole("ADMIN");
        admin.setPhone("9900011223");
        admin.setAddress("FoodLoop HQ, Tech Center");
        admin.setOrganizationName("FoodLoop Foundation");
        admin.setVerified(true);
        admin.setCreatedAt(LocalDateTime.now().minusDays(30));
        admin = userRepository.save(admin);

        // 2. Donor
        User donor = new User();
        donor.setName("Grand Feast Hotel");
        donor.setEmail("donor@foodloop.com");
        donor.setPassword(passwordEncoder.encode("Donor@123"));
        donor.setRole("DONOR");
        donor.setPhone("9876543210");
        donor.setAddress("124 Park Avenue, Jubilee Hills, Hyderabad");
        donor.setOrganizationName("Grand Feast Hospitality");
        donor.setVerified(true);
        donor.setCreatedAt(LocalDateTime.now().minusDays(15));
        donor = userRepository.save(donor);

        // 3. Verified NGO
        User ngo = new User();
        ngo.setName("Feed The Hungry Foundation");
        ngo.setEmail("ngo@foodloop.com");
        ngo.setPassword(passwordEncoder.encode("Ngo@123"));
        ngo.setRole("NGO");
        ngo.setPhone("9876543211");
        ngo.setAddress("45 Hope Road, Secunderabad");
        ngo.setOrganizationName("Feed The Hungry Society");
        ngo.setVerified(true);
        ngo.setCreatedAt(LocalDateTime.now().minusDays(10));
        ngo = userRepository.save(ngo);

        // 4. Pending NGO
        User pendingNgo = new User();
        pendingNgo.setName("Community Care Trust");
        pendingNgo.setEmail("care.ngo@foodloop.com");
        pendingNgo.setPassword(passwordEncoder.encode("Ngo@123"));
        pendingNgo.setRole("NGO");
        pendingNgo.setPhone("9876543212");
        pendingNgo.setAddress("89 River View, East District, Hyderabad");
        pendingNgo.setOrganizationName("Community Care Trust");
        pendingNgo.setVerified(false);
        pendingNgo.setCreatedAt(LocalDateTime.now().minusDays(1));
        pendingNgo = userRepository.save(pendingNgo);

        // 5. Volunteer
        User volunteer = new User();
        volunteer.setName("Alex Sharma");
        volunteer.setEmail("volunteer@foodloop.com");
        volunteer.setPassword(passwordEncoder.encode("Volunteer@123"));
        volunteer.setRole("VOLUNTEER");
        volunteer.setPhone("9876543213");
        volunteer.setAddress("Flat 302, Green Meadows, Hyderabad");
        volunteer.setVerified(true);
        volunteer.setCreatedAt(LocalDateTime.now().minusDays(7));
        volunteer = userRepository.save(volunteer);

        // 6. Donations
        FoodDonation d1 = new FoodDonation();
        d1.setDonor(donor);
        d1.setFoodName("Vegetable Dum Biryani");
        d1.setFoodDescription("Freshly cooked aromatic vegetable biryani packed in individual containers.");
        d1.setFoodCategory("VEGETARIAN");
        d1.setQuantity(30);
        d1.setQuantityUnit("MEALS");
        d1.setPreparedAt(LocalDateTime.now().minusHours(2));
        d1.setExpiryTime(LocalDateTime.now().plusHours(12));
        d1.setPickupAddress("Grand Feast Kitchen, Back Entrance, 124 Park Ave");
        d1.setStatus("AVAILABLE");
        d1.setCreatedAt(LocalDateTime.now().minusHours(1));
        donationRepository.save(d1);

        FoodDonation d2 = new FoodDonation();
        d2.setDonor(donor);
        d2.setFoodName("Assorted Bakery Breads & Buns");
        d2.setFoodDescription("Fresh bakery goods packaged from evening shift, including whole wheat bread and buns.");
        d2.setFoodCategory("BAKERY");
        d2.setQuantity(20);
        d2.setQuantityUnit("PACKETS");
        d2.setPreparedAt(LocalDateTime.now().minusHours(4));
        d2.setExpiryTime(LocalDateTime.now().plusHours(24));
        d2.setPickupAddress("Grand Feast Bakery Counter, 124 Park Ave");
        d2.setStatus("AVAILABLE");
        d2.setCreatedAt(LocalDateTime.now().minusHours(3));
        donationRepository.save(d2);

        FoodDonation d3 = new FoodDonation();
        d3.setDonor(donor);
        d3.setFoodName("Paneer Butter Masala & Rotis");
        d3.setFoodDescription("Surplus buffet preparation from luncheon event, stored at food-safe warm temperatures.");
        d3.setFoodCategory("VEGETARIAN");
        d3.setQuantity(25);
        d3.setQuantityUnit("MEALS");
        d3.setPreparedAt(LocalDateTime.now().minusHours(3));
        d3.setExpiryTime(LocalDateTime.now().plusHours(8));
        d3.setPickupAddress("Grand Feast Hotel Main Reception, 124 Park Ave");
        d3.setStatus("ACCEPTED");
        d3.setCreatedAt(LocalDateTime.now().minusHours(2));
        d3 = donationRepository.save(d3);

        // 7. Donation Request for d3
        DonationRequest req1 = new DonationRequest();
        req1.setDonation(d3);
        req1.setNgo(ngo);
        req1.setRequestedQuantity(20);
        req1.setRequestMessage("We need dinner meals for our evening shelter residents in Secunderabad.");
        req1.setStatus("ACCEPTED");
        req1.setRequestedAt(LocalDateTime.now().minusHours(1));
        req1 = requestRepository.save(req1);

        // 8. Volunteer Assignment for req1
        VolunteerAssignment assign1 = new VolunteerAssignment();
        assign1.setRequest(req1);
        assign1.setVolunteer(volunteer);
        assign1.setPickupStatus("PENDING");
        assign1.setDeliveryStatus("PENDING");
        assign1.setAssignedAt(LocalDateTime.now().minusMinutes(30));
        assignmentRepository.save(assign1);

        // 9. Initial Notifications
        Notification n1 = new Notification();
        n1.setUser(donor);
        n1.setTitle("Welcome to FoodLoop");
        n1.setMessage("Your food donor account has been successfully initialized. Start sharing surplus meals!");
        n1.setNotificationType("ACCOUNT_REGISTERED");
        n1.setIsRead(false);
        n1.setCreatedAt(LocalDateTime.now().minusDays(15));
        notificationRepository.save(n1);

        Notification n2 = new Notification();
        n2.setUser(ngo);
        n2.setTitle("Food Request Accepted");
        n2.setMessage("Your request for Paneer Butter Masala & Rotis has been accepted by Grand Feast Hotel.");
        n2.setNotificationType("REQUEST_ACCEPTED");
        n2.setIsRead(false);
        n2.setCreatedAt(LocalDateTime.now().minusHours(1));
        notificationRepository.save(n2);

        Notification n3 = new Notification();
        n3.setUser(volunteer);
        n3.setTitle("New Volunteer Assignment");
        n3.setMessage("You have been assigned to collect Paneer Butter Masala & Rotis from Grand Feast Hotel and deliver to Feed The Hungry Foundation.");
        n3.setNotificationType("VOLUNTEER_ASSIGNED");
        n3.setIsRead(false);
        n3.setCreatedAt(LocalDateTime.now().minusMinutes(30));
        notificationRepository.save(n3);

        Notification n4 = new Notification();
        n4.setUser(admin);
        n4.setTitle("Pending NGO Verification");
        n4.setMessage("New organization 'Community Care Trust' is waiting for admin verification.");
        n4.setNotificationType("NGO_PENDING");
        n4.setIsRead(false);
        n4.setCreatedAt(LocalDateTime.now().minusDays(1));
        notificationRepository.save(n4);
    }
}

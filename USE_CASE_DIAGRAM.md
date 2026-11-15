# FoodLoop – Use Case Diagram

## 1. Actors

1. Donor – Publishes and manages surplus food donations.
2. NGO – Browses available food and requests donations.
3. Volunteer – Collects and delivers donated food.
4. Admin – Manages users and verifies NGOs.

## 2. Use Cases

### Common Use Cases
- Register
- Login
- Logout
- View Profile

### Donor Use Cases
- Add Food Donation
- View My Donations
- Update Food Listing
- Delete Food Listing
- View NGO Requests
- Accept or Reject Requests

### NGO Use Cases
- Register as NGO
- View Available Food
- Search Food Donations
- Request Food Donation
- Track Donation Request

### Volunteer Use Cases
- View Assigned Pickups
- View Pickup Details
- Update Collection Status
- Update Delivery Status

### Admin Use Cases
- View Users
- Verify NGOs
- Manage Users
- Monitor Donations
- View Reports

## 3. Use Case Diagram

```mermaid
flowchart LR
    Donor[Donor]
    NGO[NGO]
    Volunteer[Volunteer]
    Admin[Admin]

    subgraph FoodLoop System
        Login((Login / Register))
        Add((Add Food Donation))
        Manage((Manage Donations))
        Requests((Manage NGO Requests))
        Browse((Browse Food))
        Request((Request Food))
        Track((Track Requests))
        Pickup((View Assigned Pickups))
        Status((Update Delivery Status))
        Verify((Verify NGOs))
        Users((Manage Users))
        Reports((View Reports))
    end

    Donor --> Login
    Donor --> Add
    Donor --> Manage
    Donor --> Requests

    NGO --> Login
    NGO --> Browse
    NGO --> Request
    NGO --> Track

    Volunteer --> Login
    Volunteer --> Pickup
    Volunteer --> Status

    Admin --> Login
    Admin --> Verify
    Admin --> Users
    Admin --> Reports
</pre>
```

## 4. Conclusion

The use case diagram identifies the four main actors and their interactions with FoodLoop. It helps define the functional responsibilities of each user.
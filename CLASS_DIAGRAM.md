# FoodLoop – Class Diagram

## 1. Purpose

The class diagram represents the main classes, attributes, methods and relationships in the FoodLoop application.

## 2. Main Classes

### 1. User
Attributes:
- userId
- name
- email
- password
- phone
- role
- address
- isVerified

Methods:
- register()
- login()
- logout()
- updateProfile()

### 2. FoodDonation
Attributes:
- donationId
- foodName
- description
- quantity
- unit
- pickupLocation
- expiryTime
- status

Methods:
- createDonation()
- updateDonation()
- deleteDonation()
- checkExpiry()

### 3. DonationRequest
Attributes:
- requestId
- requestMessage
- requestStatus
- requestedAt

Methods:
- submitRequest()
- acceptRequest()
- rejectRequest()
- updateStatus()

### 4. VolunteerAssignment
Attributes:
- assignmentId
- pickupStatus
- deliveryStatus
- assignedAt
- completedAt

Methods:
- assignVolunteer()
- updatePickupStatus()
- updateDeliveryStatus()

### 5. Notification
Attributes:
- notificationId
- message
- isRead
- createdAt

Methods:
- createNotification()
- markAsRead()

### 6. Report
Attributes:
- reportId
- totalDonations
- completedDonations
- pendingDonations
- expiredDonations

Methods:
- generateReport()
- getDonationSummary()

## 3. Class Diagram

```mermaid
classDiagram
    class User {
        +int userId
        +String name
        +String email
        +String password
        +String phone
        +String role
        +String address
        +boolean isVerified
        +register()
        +login()
        +logout()
        +updateProfile()
    }

    class FoodDonation {
        +int donationId
        +String foodName
        +String description
        +double quantity
        +String unit
        +String pickupLocation
        +DateTime expiryTime
        +String status
        +createDonation()
        +updateDonation()
        +deleteDonation()
        +checkExpiry()
    }

    class DonationRequest {
        +int requestId
        +String requestMessage
        +String requestStatus
        +DateTime requestedAt
        +submitRequest()
        +acceptRequest()
        +rejectRequest()
        +updateStatus()
    }

    class VolunteerAssignment {
        +int assignmentId
        +String pickupStatus
        +String deliveryStatus
        +DateTime assignedAt
        +DateTime completedAt
        +assignVolunteer()
        +updatePickupStatus()
        +updateDeliveryStatus()
    }

    class Notification {
        +int notificationId
        +String message
        +boolean isRead
        +DateTime createdAt
        +createNotification()
        +markAsRead()
    }

    class Report {
        +int reportId
        +int totalDonations
        +int completedDonations
        +int pendingDonations
        +int expiredDonations
        +generateReport()
        +getDonationSummary()
    }

    User "1" --> "0..*" FoodDonation : publishes
    User "1" --> "0..*" DonationRequest : submits
    FoodDonation "1" --> "0..*" DonationRequest : receives
    DonationRequest "1" --> "0..1" VolunteerAssignment : has
    User "1" --> "0..*" VolunteerAssignment : handles
    User "1" --> "0..*" Notification : receives
```

## 4. Conclusion

The class diagram describes the main objects required for FoodLoop. It provides a blueprint for implementing Java classes and database entities in the backend.
# FoodLoop – Entity Relationship Diagram

## 1. Database Entities

### 1. User
Stores information about all registered users.

Attributes:
- user_id (Primary Key)
- name
- email
- password
- phone
- role
- address
- is_verified
- created_at

### 2. FoodDonation
Stores surplus food information published by donors.

Attributes:
- donation_id (Primary Key)
- donor_id (Foreign Key)
- food_name
- description
- quantity
- unit
- pickup_location
- expiry_time
- status
- created_at

### 3. DonationRequest
Stores food donation requests submitted by NGOs.

Attributes:
- request_id (Primary Key)
- donation_id (Foreign Key)
- ngo_id (Foreign Key)
- request_message
- request_status
- requested_at

### 4. VolunteerAssignment
Stores volunteer pickup and delivery assignments.

Attributes:
- assignment_id (Primary Key)
- request_id (Foreign Key)
- volunteer_id (Foreign Key)
- pickup_status
- delivery_status
- assigned_at
- completed_at

### 5. Notification
Stores notifications sent to users.

Attributes:
- notification_id (Primary Key)
- user_id (Foreign Key)
- message
- is_read
- created_at

## 2. Relationships

1. One donor can publish many food donations.
2. One food donation can receive multiple NGO requests.
3. One NGO can submit many donation requests.
4. One donation request can have one volunteer assignment.
5. One volunteer can receive multiple assignments.
6. One user can receive multiple notifications.

## 3. ER Diagram

```mermaid id="erfoodloop"
erDiagram
    USER ||--o{ FOOD_DONATION : publishes
    USER ||--o{ DONATION_REQUEST : submits
    FOOD_DONATION ||--o{ DONATION_REQUEST : receives
    DONATION_REQUEST ||--o| VOLUNTEER_ASSIGNMENT : has
    USER ||--o{ VOLUNTEER_ASSIGNMENT : handles
    USER ||--o{ NOTIFICATION : receives

    USER {
        int user_id PK
        string name
        string email
        string password
        string phone
        string role
        string address
        boolean is_verified
        datetime created_at
    }

    FOOD_DONATION {
        int donation_id PK
        int donor_id FK
        string food_name
        string description
        decimal quantity
        string unit
        string pickup_location
        datetime expiry_time
        string status
        datetime created_at
    }

    DONATION_REQUEST {
        int request_id PK
        int donation_id FK
        int ngo_id FK
        string request_message
        string request_status
        datetime requested_at
    }

    VOLUNTEER_ASSIGNMENT {
        int assignment_id PK
        int request_id FK
        int volunteer_id FK
        string pickup_status
        string delivery_status
        datetime assigned_at
        datetime completed_at
    }

    NOTIFICATION {
        int notification_id PK
        int user_id FK
        string message
        boolean is_read
        datetime created_at
    }
```

## 4. Conclusion

The ER diagram defines the main database entities and their relationships. It will serve as the foundation for creating the FoodLoop MySQL database.
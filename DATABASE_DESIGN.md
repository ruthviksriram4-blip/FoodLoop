# FoodLoop – Database Design

## 1. Database Information

**Database Name:** foodloop_db

**Database Management System:** MySQL

The database stores users, food donations, donation requests, volunteer assignments and notifications.

## 2. Database Tables

### Table 1: users

| Column | Data Type | Constraint |
|---|---|---|
| user_id | BIGINT | Primary Key, Auto Increment |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(20) | |
| role | VARCHAR(20) | NOT NULL |
| address | VARCHAR(255) | |
| is_verified | BOOLEAN | DEFAULT FALSE |
| created_at | DATETIME | NOT NULL |

Allowed roles:
- DONOR
- NGO
- VOLUNTEER
- ADMIN

### Table 2: food_donations

| Column | Data Type | Constraint |
|---|---|---|
| donation_id | BIGINT | Primary Key, Auto Increment |
| donor_id | BIGINT | Foreign Key |
| food_name | VARCHAR(150) | NOT NULL |
| description | TEXT | |
| quantity | DECIMAL(10,2) | NOT NULL |
| unit | VARCHAR(30) | NOT NULL |
| pickup_location | VARCHAR(255) | NOT NULL |
| expiry_time | DATETIME | NOT NULL |
| status | VARCHAR(30) | NOT NULL |
| created_at | DATETIME | NOT NULL |

### Table 3: donation_requests

| Column | Data Type | Constraint |
|---|---|---|
| request_id | BIGINT | Primary Key, Auto Increment |
| donation_id | BIGINT | Foreign Key |
| ngo_id | BIGINT | Foreign Key |
| request_message | TEXT | |
| request_status | VARCHAR(30) | NOT NULL |
| requested_at | DATETIME | NOT NULL |

### Table 4: volunteer_assignments

| Column | Data Type | Constraint |
|---|---|---|
| assignment_id | BIGINT | Primary Key, Auto Increment |
| request_id | BIGINT | Foreign Key, UNIQUE |
| volunteer_id | BIGINT | Foreign Key |
| pickup_status | VARCHAR(30) | NOT NULL |
| delivery_status | VARCHAR(30) | NOT NULL |
| assigned_at | DATETIME | NOT NULL |
| completed_at | DATETIME | |

### Table 5: notifications

| Column | Data Type | Constraint |
|---|---|---|
| notification_id | BIGINT | Primary Key, Auto Increment |
| user_id | BIGINT | Foreign Key |
| message | TEXT | NOT NULL |
| is_read | BOOLEAN | DEFAULT FALSE |
| created_at | DATETIME | NOT NULL |

## 3. Primary Keys

- users: user_id
- food_donations: donation_id
- donation_requests: request_id
- volunteer_assignments: assignment_id
- notifications: notification_id

## 4. Foreign Keys

- food_donations.donor_id references users.user_id
- donation_requests.donation_id references food_donations.donation_id
- donation_requests.ngo_id references users.user_id
- volunteer_assignments.request_id references donation_requests.request_id
- volunteer_assignments.volunteer_id references users.user_id
- notifications.user_id references users.user_id

## 5. Important Validation Rules

1. Email addresses must be unique.
2. Passwords must be stored as secure password hashes, never plain text.
3. Quantity must be greater than zero.
4. Expiry time must be in the future when a new listing is created.
5. Expired donations cannot receive new requests.
6. Only verified NGOs can request donations.
7. Only users with the appropriate role can perform their assigned operations.
8. A donation request must refer to an existing food donation.

## 6. Conclusion

The FoodLoop database design defines five initial tables and their relationships. It provides the foundation for implementing the MySQL database and connecting it to the Spring Boot backend.
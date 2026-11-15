# FoodLoop – REST API Design

## 1. API Overview

FoodLoop uses REST APIs to connect the React.js frontend with the Java Spring Boot backend.

**Base URL:** http://localhost:8080/api

**Data Format:** JSON

**HTTP Methods:** GET, POST, PUT, DELETE

## 2. Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login |
| GET | /auth/profile | Get logged-in user profile |

## 3. Food Donation APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | /donations | Create food donation |
| GET | /donations | Get available donations |
| GET | /donations/{id} | Get donation by ID |
| GET | /donations/my | Get donor's listings |
| PUT | /donations/{id} | Update donation |
| DELETE | /donations/{id} | Delete donation |

## 4. Donation Request APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | /requests | Submit a donation request |
| GET | /requests/my | Get current NGO's requests |
| GET | /requests/donation/{donationId} | Get requests for a donation |
| PUT | /requests/{id}/accept | Accept a request |
| PUT | /requests/{id}/reject | Reject a request |

## 5. Volunteer APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /volunteers/assignments | Get assigned pickups |
| PUT | /volunteers/assignments/{id}/pickup | Update pickup status |
| PUT | /volunteers/assignments/{id}/delivery | Update delivery status |

## 6. Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /admin/users | View all users |
| PUT | /admin/ngos/{id}/verify | Verify NGO |
| PUT | /admin/users/{id}/status | Update user status |
| GET | /admin/reports | View donation reports |

## 7. Notification APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /notifications | Get user notifications |
| PUT | /notifications/{id}/read | Mark notification as read |

## 8. HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Permission denied |
| 404 | Resource not found |
| 500 | Internal server error |

## 9. Example JSON Request

### Create Food Donation

POST /api/donations

```json
{
  "foodName": "Vegetable Rice",
  "description": "Freshly prepared surplus food",
  "quantity": 20,
  "unit": "plates",
  "pickupLocation": "Warangal",
  "expiryTime": "2026-11-15T14:00:00"
}
```

The backend must validate the input, including the expiry time, before saving the donation.

## 10. Example JSON Response

```json
{
  "message": "Food donation created successfully",
  "status": "AVAILABLE"
}
```

## 11. Conclusion

The API design defines the communication endpoints between the frontend and backend. These endpoints will guide the implementation of REST controllers in Spring Boot.
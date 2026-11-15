# FoodLoop – System Architecture

## 1. Architecture Overview

FoodLoop follows a three-layer architecture. It separates the user interface, application logic and database.

The three layers are:

1. Presentation Layer – React.js
2. Application Layer – Java Spring Boot
3. Data Layer – MySQL

## 2. Presentation Layer – React.js

The presentation layer provides the user interface.

Responsibilities:
- User registration and login pages.
- Donor dashboard.
- NGO dashboard.
- Volunteer dashboard.
- Admin dashboard.
- Food donation forms.
- Food listing and search pages.
- Donation request tracking.
- Display notifications and reports.

## 3. Application Layer – Java Spring Boot

The application layer handles the business logic.

Responsibilities:
- User authentication and authorisation.
- Role-based access control.
- Food donation management.
- NGO donation requests.
- Donor approval and rejection.
- Volunteer assignment.
- Pickup and delivery status updates.
- Expiry validation.
- Notification management.
- Report generation.

The frontend communicates with this layer through REST APIs.

## 4. Data Layer – MySQL

The data layer stores the application's information.

Main data categories:
- User information.
- NGO verification information.
- Food donation details.
- Donation requests.
- Volunteer assignments.
- Notification records.
- Donation status and history.

## 5. Communication Between Layers

1. Users interact with the React.js frontend.
2. React.js sends HTTP requests to Spring Boot REST APIs.
3. Spring Boot validates requests and applies business rules.
4. Spring Boot communicates with MySQL to store or retrieve data.
5. Spring Boot returns responses to React.js.
6. React.js displays the results to users.

## 6. Architecture Diagram

```text
+--------------------------------------+
|              USERS                   |
|                                      |
| Donor | NGO | Volunteer | Admin      |
+------------------+-------------------+
                   |
                   v
+--------------------------------------+
|         PRESENTATION LAYER           |
|                                      |
|              React.js                |
|                                      |
| Dashboards | Forms | Food Listings   |
+------------------+-------------------+
                   |
             REST API / HTTP
                   |
                   v
+--------------------------------------+
|          APPLICATION LAYER           |
|                                      |
|            Spring Boot               |
|                                      |
| Authentication | Food Management     |
| Donation Requests | Volunteer        |
| Notifications | Reports              |
+------------------+-------------------+
                   |
             Database Access
                   |
                   v
+--------------------------------------+
|             DATA LAYER               |
|                                      |
|                MySQL                 |
|                                      |
| Users | Food | Requests | Assignments|
+--------------------------------------+
```

## 7. Advantages of This Architecture

- Separation of responsibilities.
- Easier development and maintenance.
- Better organisation of code.
- Centralised business logic.
- Secure communication between application layers.
- Easier future expansion.

## 8. Conclusion

FoodLoop uses React.js for the frontend, Java Spring Boot for backend processing and MySQL for data storage. The three-layer architecture provides a structured foundation for developing the complete application.
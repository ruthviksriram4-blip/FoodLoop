# FoodLoop – Software Requirements Specification

## 1. Project Overview

**Project Name:** FoodLoop – Smart Surplus Food Redistribution System

**Project Type:** Full Stack Web Application

FoodLoop is a web-based application that connects food donors with NGOs and volunteers to reduce food wastage and redistribute surplus food to people in need.

## 2. User Roles

1. **Donor:** Restaurants, hotels, colleges and event organisers who donate surplus food.
2. **NGO:** Registered organisations that accept food donations and distribute food to people in need.
3. **Volunteer:** People who collect and deliver donated food.
4. **Admin:** Manages users, verifies NGOs and monitors the complete system.

## 3. Functional Requirements

- FR01: Users can register and log in.
- FR02: Users can access features according to their roles.
- FR03: Donors can add surplus food details.
- FR04: Donors can edit and delete their food listings.
- FR05: NGOs can view available food donations.
- FR06: NGOs can request available food.
- FR07: Donors can approve or reject donation requests.
- FR08: Admin can verify NGO accounts.
- FR09: Admin can manage registered users.
- FR10: Volunteers can view assigned pickups.
- FR11: Volunteers can update pickup and delivery status.
- FR12: Users can receive notifications.
- FR13: The system can identify expired food listings.
- FR14: Admin can view donation reports.

## 4. Non-Functional Requirements

- Security: Passwords must be securely stored.
- Performance: The application should respond efficiently.
- Reliability: Donation information must be stored correctly.
- Usability: The interface should be simple and user-friendly.
- Maintainability: The application should use modular code.
- Scalability: The application should support increasing users.
- Data Integrity: Invalid quantities and expired food must be rejected.

## 5. Technology Stack

- Frontend: React.js
- Backend: Java Spring Boot
- Database: MySQL
- API: REST API
- Styling: CSS
- Authentication: Spring Security

## 6. Expected Outcome

A working web application that allows donors to publish surplus food, NGOs to request donations, volunteers to manage pickups and administrators to monitor donation activities.

The system aims to reduce avoidable food wastage through organised food redistribution.
# FoodLoop – Smart Surplus Food Redistribution System

FoodLoop is a full-stack web application designed to connect surplus food donors (restaurants, hotels, event organizers) with registered NGOs and volunteers to reduce food wastage and deliver fresh meals to communities in need.

---

## 🌟 Key Features by User Role

### 1. 🍽️ Donor Dashboard
- **Create & Manage Listings:** Publish surplus food with category, quantity, unit, preparation time, expiry time, and pickup address.
- **NGO Request Review:** View incoming NGO requests and approve or reject them.
- **Volunteer Assignment:** Assign registered volunteers to approved requests for scheduled pickup and delivery.
- **Automated Alerts:** Receive notifications when requests arrive, volunteers are assigned, and food is delivered.

### 2. 🏢 NGO Dashboard
- **Browse Surplus Food:** Real-time catalog of available non-expired food donations.
- **Request Donations:** Submit requests specifying required quantities and distribution notes.
- **Verification Protection:** Only admin-verified NGOs are authorized to request food (automatic validation).
- **Delivery Tracking:** Real-time visibility into volunteer assignment, pickup collection, and arrival at the NGO.

### 3. 🚚 Volunteer Dashboard
- **Available Pickups:** Discover and self-claim accepted donation requests awaiting a volunteer.
- **Active Assignments:** View detailed donor pickup address/phone and destination NGO delivery address/phone.
- **Status Updates:** Mark food as **Collected** (in transit) and **Delivered** with instant notifications dispatched.

### 4. 🛡️ Admin Dashboard
- **Overview & Analytics:** Real-time platform statistics for users, donations, requests, and deliveries.
- **NGO Verification:** Review and verify registered NGO accounts with 1-click authorization.
- **User Management:** Manage users across Donor, NGO, and Volunteer roles.
- **System Reports:** Detailed donation and redistribution reports with print/export support.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, React Router v6, Axios, Modern CSS
- **Backend:** Java 21, Spring Boot 4 / 3, Spring Data JPA, Hibernate, Spring Security
- **Authentication:** Stateless JWT (JSON Web Tokens) with BCrypt password hashing
- **Database:** MySQL 8/9 (`foodloop_db`) with automatic schema migration (`ddl-auto=update`)
- **Architecture:** RESTful Micro-services inspired Modular MVC Architecture

---

## 🚀 Quick Start (One-Click)

### 1. Start Application
To start the database, backend, and frontend concurrently:
```bash
./start.sh
```

- **Frontend Web Application:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:8080/api](http://localhost:8080/api)
- **Health Check:** [http://localhost:8080/api/health](http://localhost:8080/api/health)

### 2. Stop Application
To gracefully shut down all running services:
```bash
./stop.sh
```

---

## 🔑 Pre-Configured Demo Accounts

For instant evaluation, the application includes seeded demo accounts accessible with 1-click fill buttons on the login page:

| Role | Email | Password | Permissions & Description |
|---|---|---|---|
| **Admin** | `admin@foodloop.com` | `Admin@123` | Full administrative rights, NGO verification & reporting |
| **Donor** | `donor@foodloop.com` | `Donor@123` | Grand Feast Hotel – Food listing & volunteer assignment |
| **Verified NGO** | `ngo@foodloop.com` | `Ngo@123` | Feed The Hungry Foundation – Verified NGO |
| **Pending NGO** | `care.ngo@foodloop.com` | `Ngo@123` | Community Care Trust – Pending admin verification |
| **Volunteer** | `volunteer@foodloop.com` | `Volunteer@123` | Alex Sharma – Active courier volunteer |

---

## 📡 REST API Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/users/register` | Public | Register new user (Donor, NGO, Volunteer) |
| `POST` | `/api/users/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/health` | Public | Service health verification |
| `GET` | `/api/users/volunteers` | Authenticated | List all active volunteers |
| `GET` | `/api/donations/available` | Authenticated | List available, non-expired food donations |
| `POST` | `/api/donations` | Donor, Admin | Publish a new surplus food donation |
| `POST` | `/api/requests` | Verified NGO, Admin | Submit a request for available food |
| `PUT` | `/api/requests/{id}/accept` | Donor, Admin | Accept donation request |
| `POST` | `/api/assignments` | Donor, Admin | Assign volunteer to accepted request |
| `POST` | `/api/assignments/{id}/claim` | Volunteer, Admin | Self-claim available delivery assignment |
| `PUT` | `/api/assignments/{id}/collect` | Volunteer, Admin | Mark food as collected from donor |
| `PUT` | `/api/assignments/{id}/deliver` | Volunteer, Admin | Mark food as delivered to NGO |
| `GET` | `/api/admin/reports` | Admin | Comprehensive system reports & metrics |
| `PUT` | `/api/admin/ngos/{id}/verify` | Admin | Verify an NGO account |

---

## 📄 License
This project was developed for the FoodLoop Food Redistribution Initiative.

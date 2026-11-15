# FoodLoop – System Modules

## 1. Authentication Module
- User registration.
- User login and logout.
- Password encryption.
- Role-based access control.
- Support for Donor, NGO, Volunteer and Admin roles.

## 2. Donor Module
- Donor dashboard.
- Add surplus food donations.
- View donation history.
- Update food details.
- Delete food listings.
- Accept or reject NGO requests.

## 3. NGO Module
- NGO registration and login.
- View available food donations.
- Search and filter food listings.
- Request food donations.
- Track request status.
- View accepted donations.

## 4. Volunteer Module
- Volunteer dashboard.
- View assigned pickups.
- View donor and NGO details.
- Update pickup status.
- Update delivery status.

## 5. Admin Module
- Admin dashboard.
- View registered users.
- Verify NGO accounts.
- Manage user accounts.
- Monitor donations.
- Generate donation reports.

## 6. Food Management Module
- Create food listings.
- Store food name and description.
- Store quantity and pickup location.
- Store food expiry date and time.
- Display available food.
- Prevent requests for expired listings.

## 7. Donation Request Module
- Allow verified NGOs to request food.
- Store donation requests.
- Allow donors to accept or reject requests.
- Assign volunteers after acceptance.
- Track the complete donation process.

## 8. Notification Module
- Notify NGOs about donation updates.
- Notify donors about NGO requests.
- Notify volunteers about pickup assignments.
- Display important status updates.

## 9. Reports Module
- Total food donations.
- Completed donations.
- Pending donations.
- Rejected and expired donations.
- Donation activity summary.

## 10. Module Interaction

The modules work together as follows:

1. Users register and log in through Authentication.
2. Donors publish surplus food through the Donor and Food Management modules.
3. NGOs browse food listings and submit requests.
4. Donors approve or reject requests.
5. Volunteers receive assignments and update pickup and delivery status.
6. Notifications communicate important updates.
7. Admin monitors users, donations and reports.

## Conclusion

FoodLoop uses a modular structure to organise its features. Each module has a specific responsibility, making the application easier to develop, test, maintain and extend.
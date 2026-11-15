package com.foodloop_backend.controller;

import com.foodloop_backend.dto.NotificationResponse;
import com.foodloop_backend.service.NotificationService;
import com.foodloop_backend.service.CurrentUserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    public NotificationController(
            NotificationService notificationService,
            CurrentUserService currentUserService) {
        this.notificationService = notificationService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<NotificationResponse> getAllNotifications() {

        if (!currentUserService.isAdmin()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can view all notifications");
        }

        return notificationService.getAllNotifications();
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponse> getNotificationsByUser(
            @PathVariable Long userId) {

        verifyUser(userId);

        return notificationService.getNotificationsByUser(userId);
    }

    @GetMapping("/unread/{userId}")
    public List<NotificationResponse> getUnreadNotifications(
            @PathVariable Long userId) {

        verifyUser(userId);

        return notificationService.getUnreadNotifications(userId);
    }

    @GetMapping("/unread-count/{userId}")
    public long getUnreadCount(@PathVariable Long userId) {

        verifyUser(userId);

        return notificationService.getUnreadCount(userId);
    }

    @PutMapping("/{notificationId}/read")
    public NotificationResponse markAsRead(
            @PathVariable Long notificationId) {

        return notificationService.markAsRead(
                notificationId,
                currentUserService.getCurrentUserId());
    }

    @DeleteMapping("/{notificationId}")
    public String deleteNotification(
            @PathVariable Long notificationId) {

        notificationService.deleteNotification(
                notificationId,
                currentUserService.getCurrentUserId());

        return "Notification deleted successfully!";
    }

    private void verifyUser(Long userId) {

        if (!currentUserService.isAdmin() &&
                !currentUserService.getCurrentUserId().equals(userId)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access another user's notifications");
        }
    }
}
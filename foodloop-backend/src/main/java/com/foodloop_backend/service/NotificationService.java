
package com.foodloop_backend.service;

import com.foodloop_backend.dto.NotificationRequest;
import com.foodloop_backend.dto.NotificationResponse;
import com.foodloop_backend.entity.Notification;
import com.foodloop_backend.entity.User;
import com.foodloop_backend.repository.NotificationRepository;
import com.foodloop_backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    private NotificationResponse convertToResponse(
            Notification notification) {

        return new NotificationResponse(
                notification.getNotificationId(),
                notification.getUser().getUserId(),
                notification.getUser().getName(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getNotificationType(),
                notification.getIsRead(),
                notification.getCreatedAt()
        );
    }

    // Existing manual notification API
    public NotificationResponse createNotification(
            NotificationRequest request) {

        if (!currentUserService.isAdmin()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can create notifications manually");

        if (request.getUserId() == null
                || request.getTitle() == null
                || request.getMessage() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User ID, title and message are required");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"));

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setNotificationType(
                request.getNotificationType());
        notification.setIsRead(false);

        return convertToResponse(
                notificationRepository.save(notification));
    }

    // New helper for automatic notifications
    public NotificationResponse createNotification(
            Long userId,
            String title,
            String message,
            String notificationType) {

        User user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(notificationType);
        notification.setIsRead(false);
        return convertToResponse(notificationRepository.save(notification));
    }

    public List<NotificationResponse> getAllNotifications() {

        if (!currentUserService.isAdmin()) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can view all notifications");

        return notificationRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<NotificationResponse> getNotificationsByUser(
            Long userId) {

        userId = verifyRequestedUser(userId);

        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found");
        }

        return notificationRepository
                .findByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<NotificationResponse> getUnreadNotifications(
            Long userId) {

        userId = verifyRequestedUser(userId);

        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found");
        }

        return notificationRepository
                .findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(
                        userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public long getUnreadCount(Long userId) {

        userId = verifyRequestedUser(userId);

        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found");
        }

        return notificationRepository
                .countByUser_UserIdAndIsReadFalse(userId);
    }

    public NotificationResponse markAsRead(
            Long notificationId, Long userId) {

        Notification notification = getNotification(notificationId);

        verifyOwner(notification);

        notification.setIsRead(true);

        return convertToResponse(
                notificationRepository.save(notification));
    }

    public void deleteNotification(
            Long notificationId, Long userId) {

        Notification notification = getNotification(notificationId);

        verifyOwner(notification);

        notificationRepository.delete(notification);
    }

    private Notification getNotification(Long notificationId) {

        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Notification not found"));
    }

    private Long verifyRequestedUser(Long requestedId) {
        User current = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin() && !current.getUserId().equals(requestedId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access another user's notifications");
        return currentUserService.isAdmin() ? requestedId : current.getUserId();
    }

    private void verifyOwner(Notification notification) {

        if (!currentUserService.isAdmin() && !notification.getUser().getUserId().equals(currentUserService.getCurrentUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot manage this notification");
        }
    }
}

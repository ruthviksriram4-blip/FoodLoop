
package com.foodloop_backend.dto;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long notificationId;
    private Long userId;
    private String userName;
    private String title;
    private String message;
    private String notificationType;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public NotificationResponse(
            Long notificationId,
            Long userId,
            String userName,
            String title,
            String message,
            String notificationType,
            Boolean isRead,
            LocalDateTime createdAt) {

        this.notificationId = notificationId;
        this.userId = userId;
        this.userName = userName;
        this.title = title;
        this.message = message;
        this.notificationType = notificationType;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getNotificationType() {
        return notificationType;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

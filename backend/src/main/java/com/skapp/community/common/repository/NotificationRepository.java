package com.skapp.community.common.repository;

import com.skapp.community.common.model.Notification;
import com.skapp.community.common.payload.request.NotificationsFilterDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository {

	Page<Notification> findAllByUserIDAndNotificationFilterDto(Long userId,
			NotificationsFilterDto notificationsFilterDto, Pageable pageable);

	long countUnreadNotificationsByUserId(Long userId);

}

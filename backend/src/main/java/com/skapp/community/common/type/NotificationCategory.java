package com.skapp.community.common.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum NotificationCategory {

	PEOPLE("people"), LEAVE("leave"), ATTENDANCE("attendance");

	private final String label;

}

package com.skapp.community.timeplanner.payload.response;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
public class TimeConfigResponseDto {

	private Long id;

	private DayOfWeek day;

	private JsonNode timeBlocks;

	private Float totalHours;

	private Boolean isWeekStartDay;

	private LocalTime startTime;

}

package com.skapp.community.peopleplanner.payload.response;

import com.skapp.community.peopleplanner.type.HolidayDuration;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HolidayResponseDto {

	private Long id;

	private LocalDate date;

	private String name;

	private HolidayDuration holidayDuration;

}

package com.skapp.community.timeplanner.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeeAttendanceSummaryFilterDto {

	@NotNull
	private LocalDate startDate;

	@NotNull
	private LocalDate endDate;

}

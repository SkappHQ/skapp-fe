package com.skapp.community.timeplanner.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ManagerAttendanceSummaryFilterDto {

	@NotNull
	@Schema(description = "Attendance summary start date")
	private LocalDate startDate;

	@NotNull
	@Schema(description = "Attendance summary end date")
	private LocalDate endDate;

	@NotNull
	@Schema(description = "Team is list")
	private List<Long> teamIds;

}

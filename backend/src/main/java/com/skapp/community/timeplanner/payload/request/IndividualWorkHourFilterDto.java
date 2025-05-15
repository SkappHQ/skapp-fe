package com.skapp.community.timeplanner.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IndividualWorkHourFilterDto {

	@Min(1)
	@Max(12)
	private int month;

	private long employeeId;

}

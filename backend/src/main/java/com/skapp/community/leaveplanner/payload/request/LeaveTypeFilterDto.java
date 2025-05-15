package com.skapp.community.leaveplanner.payload.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

@Setter
@Getter
public class LeaveTypeFilterDto {

	@Nullable
	private Boolean filterByInUse = false;

	@Nullable
	private Boolean isCarryForward = false;

}

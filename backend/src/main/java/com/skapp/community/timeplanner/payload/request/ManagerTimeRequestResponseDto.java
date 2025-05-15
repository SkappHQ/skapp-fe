package com.skapp.community.timeplanner.payload.request;

import com.skapp.community.peopleplanner.payload.request.EmployeeDto;
import com.skapp.community.peopleplanner.type.RequestStatus;
import com.skapp.community.peopleplanner.type.RequestType;
import com.skapp.community.timeplanner.payload.response.TimeRecordParentDto;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManagerTimeRequestResponseDto {

	@NotNull
	private Long timeRequestId;

	// ClockIn & ClockOut Time Will be only use in edit time requests
	private Long initialClockIn;

	private Long initialClockOut;

	@NotNull
	private Long requestedStartTime;

	@NotNull
	private Long requestedEndTime;

	@NotNull
	private RequestType requestType;

	@NotNull
	private RequestStatus status;

	private double workHours;

	@NotNull
	private EmployeeDto employee;

	private TimeRecordParentDto timeRecord;

}

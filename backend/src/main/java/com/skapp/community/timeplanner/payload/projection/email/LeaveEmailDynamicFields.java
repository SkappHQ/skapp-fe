package com.skapp.community.timeplanner.payload.projection.email;

import com.skapp.community.common.payload.email.CommonEmailDynamicFields;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveEmailDynamicFields extends CommonEmailDynamicFields {

	private String leaveType;

	private String leaveStartDate;

	private String leaveEndDate;

	private String leaveDuration;

	private String comment;

	private String employeesName;

}

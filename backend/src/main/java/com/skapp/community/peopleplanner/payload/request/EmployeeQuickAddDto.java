package com.skapp.community.peopleplanner.payload.request;

import com.skapp.community.peopleplanner.payload.request.employee.EmployeeSystemPermissionsDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeQuickAddDto {

	private String firstName;

	private String lastName;

	private String email;

	private EmployeeSystemPermissionsDto userRoles;

}

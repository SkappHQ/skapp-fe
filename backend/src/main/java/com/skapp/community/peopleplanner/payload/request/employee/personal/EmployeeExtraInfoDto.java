package com.skapp.community.peopleplanner.payload.request.employee.personal;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeExtraInfoDto {

	private String allergies;

	private String dietaryRestrictions;

	@JsonProperty("tShirtSize")
	private String tShirtSize;

}

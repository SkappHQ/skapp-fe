package com.skapp.community.peopleplanner.payload.request.employee.personal;

import com.skapp.community.peopleplanner.type.Gender;
import com.skapp.community.peopleplanner.type.MaritalStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EmployeePersonalGeneralDetailsDto {

	private String firstName;

	private String middleName;

	private String lastName;

	private Gender gender;

	private LocalDate dateOfBirth;

	private String nationality;

	private String nin;

	private String passportNumber;

	private MaritalStatus maritalStatus;

}

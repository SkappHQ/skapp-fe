package com.skapp.community.timeplanner.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;

@Getter
@Setter
public class TeamTimeRecordFilterDto {

	private Long teamId;

	private int pageNumber = 0;

	private int pageSize = 10;

	private Sort.Direction sortBy = Sort.Direction.ASC;

	private Boolean isExport = false;

	@NotNull
	private LocalDate startDate;

	@NotNull
	private LocalDate endDate;

}

package com.skapp.community.timeplanner.repository;

import com.skapp.community.peopleplanner.model.Employee;
import com.skapp.community.peopleplanner.payload.request.EmployeeTimeRequestFilterDto;
import com.skapp.community.timeplanner.model.TimeRequest;
import com.skapp.community.timeplanner.payload.request.ManagerTimeRequestFilterDto;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TimeRequestRepository {

	Page<TimeRequest> findAllTimeRequestsOnDateByFilters(Employee currentEmployee,
			EmployeeTimeRequestFilterDto employeeTimeRequestFilterDto, Pageable pageable);

	/**
	 * Retrieves Time requests in approved & pending status based on the parameters passed
	 * inside the filter dto
	 * @param employeeTimeRequestFilterDto Object having filter parameters
	 * @return filtered time requests in pageable
	 */
	List<TimeRequest> findTimeRequestsByOptionalFilters(EmployeeTimeRequestFilterDto employeeTimeRequestFilterDto);

	List<TimeRequest> findPendingEntryRequestsWithoutTimeRecordId(@NotNull Long employeeId, @NotNull Long startTime,
			@NotNull Long endTime);

	Page<TimeRequest> findAllAssignEmployeesTimeRequests(Long userId, ManagerTimeRequestFilterDto timeRequestFilterDto,
			Pageable pageable);

	Long countSupervisedPendingTimeRequests(Long userId);

}

package com.skapp.community.leaveplanner.repository;

import com.skapp.community.leaveplanner.model.LeaveRequest;
import com.skapp.community.leaveplanner.repository.projection.LeaveTrendByDay;
import com.skapp.community.leaveplanner.repository.projection.LeaveTrendByMonth;
import com.skapp.community.leaveplanner.repository.projection.LeaveTypeBreakDown;
import com.skapp.community.leaveplanner.repository.projection.LeaveUtilizationByEmployeeMonthly;
import com.skapp.community.leaveplanner.repository.projection.ManagerLeaveTrend;
import com.skapp.community.leaveplanner.repository.projection.OrganizationLeaveTrendForTheYear;
import com.skapp.community.leaveplanner.repository.projection.TeamLeaveCountByType;
import com.skapp.community.leaveplanner.repository.projection.TeamLeaveTrendForTheYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestDao
		extends JpaRepository<LeaveRequest, Long>, JpaSpecificationExecutor<LeaveRequest>, LeaveRequestRepository {

	/**
	 * The Following query will generate a table which contains of 1000 dates, starting
	 * considering received parameter date relevant beginning of the year, and check them
	 * against each approved employee leave request, considering relevant month and/or
	 * year based on the received date parameter, and will return total employee count
	 * relevant for each day/month. The Same approach has been followed for the rest of
	 * the leave trend and leave type breakdown queries.
	 * @param startDate One month before the requested date
	 * @param endDate Requested date
	 * @return Leave Dates with Leave Count
	 */
	@Query(nativeQuery = true,
			value = """
					SELECT leaveDate, COUNT(DISTINCT lr.employee_id) AS employeeCount
					FROM (SELECT ADDDATE(MAKEDATE(YEAR(?1), 1), t2.i*100 + t1.i*10 + t0.i) AS leaveDate FROM
							(SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
							(SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
							(SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
						 ) AS v, leave_request AS lr
						                      JOIN employee
					         ON lr.employee_id=employee.employee_id
					         JOIN user
					         ON lr.employee_id = user.user_id
					WHERE (leaveDate BETWEEN ?1 AND ?2) AND (leaveDate BETWEEN lr.start_date AND lr.end_date) AND ((leaveDate NOT IN ?4) OR (NOT EXISTS (SELECT 1 FROM holiday WHERE is_active=1))) AND ((WEEKDAY(leaveDate) IN ?3) OR (NOT EXISTS (SELECT 1 FROM time_config))) AND lr.`status` IN ('APPROVED', 'PENDING')  AND (NOT (user.`is_active` = '0'))
					GROUP BY leaveDate
					ORDER BY leaveDate;""")
	List<LeaveTrendByDay> findLeaveTrendAwayByDay(LocalDate startDate, LocalDate endDate,
			List<Integer> workingDaysIndex, List<LocalDate> holidayDates);

	@Query(nativeQuery = true,
			value = """
					SELECT MONTH(leave_date) AS keyValue, COUNT(DISTINCT lr.employee_id) AS employeeCount
					FROM (SELECT ADDDATE(MAKEDATE(YEAR(?1), 1), t2.i*100 + t1.i*10 + t0.i) AS leave_date FROM
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
					) AS v, leave_request AS lr
					JOIN employee
					ON lr.employee_id=employee.employee_id
					JOIN user
					ON lr.employee_id = user.user_id
					WHERE (leave_date BETWEEN ?1 AND ?2) AND (leave_date BETWEEN lr.start_date AND lr.end_date) AND ((WEEKDAY(leave_date) IN ?3) OR (NOT EXISTS (SELECT 1 FROM time_config))) AND ((leave_date NOT IN ?4) OR (NOT EXISTS (SELECT 1 FROM holiday WHERE is_active=1))) AND lr.`status` IN ('APPROVED', 'PENDING') AND (NOT (user.`is_active` = '0'))
					GROUP BY keyValue;""")
	List<LeaveTrendByMonth> findLeaveTrendAwayByMonth(LocalDate startDate, LocalDate endDate,
			List<Integer> workingDaysIndex, List<LocalDate> holidayDates);

	@Query(nativeQuery = true,
			value = """
					SELECT lt.`type_id` AS leaveType, MONTH(leave_date) AS keyValue,
					 COALESCE(SUM(CASE\s
					WHEN lr.leave_state = 'HALFDAY_MORNING' THEN 0.5
					WHEN lr.leave_state = 'HALFDAY_EVENING' THEN 0.5
					ELSE 1
					END
					), 0) AS leaveCount
					FROM (SELECT ADDDATE(MAKEDATE(YEAR(?3), 1), t2.i*100 + t1.i*10 + t0.i) AS leave_date FROM
						(SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
					    (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
						(SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
					) AS v, leave_request AS lr
					            JOIN employee
					         ON lr.employee_id=employee.employee_id
					         LEFT JOIN employee_team et ON lr.employee_id = et.employee_id
					         JOIN user
					         ON lr.employee_id = user.user_id, leave_type AS lt
					WHERE (leave_date BETWEEN ?3 AND ?4) and (leave_date BETWEEN lr.start_date AND lr.end_date) AND ((WEEKDAY(leave_date) IN ?1) OR (NOT EXISTS (SELECT 1 FROM time_config))) AND ((leave_date NOT IN ?2) OR (NOT EXISTS (SELECT 1 FROM holiday WHERE is_active=1))) AND lr.`status` IN ('APPROVED')
					AND (lr.type_id IN (?5) OR concat(?5) IS NULL)
					AND (et.team_id IN (?6) OR concat(?6) IS NULL)
					AND lr.type_id = lt.type_id AND lt.`is_active` = 1  AND (NOT (user.`is_active` = '0'))
					GROUP BY keyValue, leaveType
					ORDER BY keyValue, leaveType;
					""")
	List<LeaveTypeBreakDown> findLeaveTypeBreakDown(List<Integer> workingDaysIndex, List<LocalDate> holidayDates,
			LocalDate startDate, LocalDate endDate, List<Long> typeIds, List<Long> teamIds);

	/**
	 * The Following query will return the approved and pending leave request count of the
	 * employee during the required time period
	 * @param startDate starting date of the required period
	 * @param endDate end date of the required period
	 * @param workingDaysIndex company working days indices
	 * @param holidayDates holidays of the company
	 * @param employeeId id of the employee
	 * @param typeIds ids of leave types
	 * @return Leave type month value, leave type id and approved leave request count
	 */
	@Query(nativeQuery = true,
			value = """
					SELECT lr.type_id as leaveType, MONTH(leaveDate) AS monthValue,
					       COALESCE(SUM(CASE
					            WHEN lr.leave_state = 'HALFDAY_MORNING' OR lr.leave_state = 'HALFDAY_EVENING' THEN 0.5
					            ELSE 1
					       END), 0) AS leaveCount
					FROM (SELECT ADDDATE(MAKEDATE(YEAR(?1), 1), t2.i*100 + t1.i*10 + t0.i) AS leaveDate
					      FROM (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
					           (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
					           (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
					     ) AS v, leave_request AS lr
					     JOIN employee ON lr.employee_id = employee.employee_id
					     JOIN user ON lr.employee_id = user.user_id
					WHERE (leaveDate BETWEEN ?1 AND ?2)
					  AND (leaveDate BETWEEN lr.start_date AND lr.end_date)
					  AND ((leaveDate NOT IN ?4) OR (NOT EXISTS (SELECT 1 FROM holiday WHERE is_active = 1)))
					  AND ((WEEKDAY(leaveDate) IN ?3) OR (NOT EXISTS (SELECT 1 FROM time_config)))
					  AND (lr.`status` = 'APPROVED' OR lr.`status` = 'PENDING')
					  AND (NOT (user.`is_active` = '0'))
					  AND lr.employee_id = ?5
					  AND (lr.type_id IN ?6)
					GROUP BY monthValue, leaveType
					ORDER BY monthValue, leaveType;
					""")
	List<LeaveUtilizationByEmployeeMonthly> findLeaveUtilizationByEmployeeMonthly(LocalDate startDate,
			LocalDate endDate, List<Integer> workingDaysIndex, List<LocalDate> holidayDates, Long employeeId,
			List<Long> typeIds);

	/**
	 * The Following query will return approved leave count for the given employees based
	 * on given leave types
	 * @param workingDaysIndex indices of the working days in time config
	 * @param holidayDates holiday dates
	 * @param leaveTypeIds leave type ids
	 * @return Employee Ids, month integers and total approved leave request counts
	 */
	@Query(nativeQuery = true,
			value = """
					SELECT leave_type.type_id AS LeaveType, MONTH(leave_date) AS keyValue,
					COALESCE(SUM(CASE\s
					WHEN lr.leave_state = 'HALFDAY_MORNING' THEN 0.5
					WHEN lr.leave_state = 'HALFDAY_EVENING' THEN 0.5
					ELSE 1
					END
					), 0) AS leaveRequestCount
					FROM (SELECT ADDDATE(MAKEDATE(YEAR(?4), 1), t2.i*100 + t1.i*10 + t0.i) AS leave_date FROM
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
					) AS v, leave_request AS lr
					JOIN employee
					ON lr.employee_id=employee.employee_id
					JOIN leave_type
					ON lr.type_id = leave_type.type_id
					JOIN user
					ON lr.employee_id = user.user_id
					WHERE (leave_date BETWEEN lr.start_date AND lr.end_date)
					    AND ((leave_date NOT IN ?2) OR (NOT EXISTS (SELECT 1 FROM holiday WHERE is_active=1)))
					    AND ((WEEKDAY(leave_date) IN ?1) OR (NOT EXISTS (SELECT 1 FROM time_config))) AND (lr.`status` = 'APPROVED' or lr.`status` = 'PENDING')
					    AND (NOT (user.`is_active` = '0')) AND (leave_type.type_id IN ?3) AND (leave_date BETWEEN ?4 AND ?5)
					GROUP BY keyValue, LeaveType
					ORDER BY keyValue, LeaveType;""")
	List<OrganizationLeaveTrendForTheYear> findOrganizationLeaveTrendForTheYear(List<Integer> workingDaysIndex,
			List<LocalDate> holidayDates, List<Long> leaveTypeIds, LocalDate startDate, LocalDate endDate);

	@Query(nativeQuery = true,
			value = """
					SELECT leave_type.type_id AS LeaveType, MONTH(leave_date) AS keyValue,
					COALESCE(SUM(CASE\s
					WHEN lr.leave_state = 'HALFDAY_MORNING' THEN 0.5
					WHEN lr.leave_state = 'HALFDAY_EVENING' THEN 0.5
					ELSE 1
					END
					), 0) AS leaveRequestCount
					FROM (SELECT ADDDATE(MAKEDATE(YEAR(?5), 1), t2.i*100 + t1.i*10 + t0.i) AS leave_date FROM
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
					) AS v, leave_request AS lr
					JOIN employee
					ON lr.employee_id = employee.employee_id
					JOIN leave_type
					ON lr.type_id = leave_type.type_id
					JOIN employee_team
					ON lr.employee_id = employee_team.employee_id
					JOIN user
					ON lr.employee_id = user.user_id
					WHERE employee_team.team_id = ?1
					    AND (leave_date BETWEEN lr.start_date AND lr.end_date)
					    AND ((leave_date NOT IN ?3) OR (NOT EXISTS (SELECT 1 FROM holiday WHERE is_active=1)))
					    AND ((WEEKDAY(leave_date) IN ?2) OR (NOT EXISTS (SELECT 1 FROM time_config))) AND (lr.`status` = 'APPROVED' or lr.`status` = 'PENDING')
					    AND (NOT (user.`is_active` = '0')) AND (leave_type.type_id IN ?4) AND (leave_date BETWEEN ?5 AND ?6)
					GROUP BY keyValue, LeaveType
					ORDER BY keyValue, LeaveType;""")
	List<TeamLeaveTrendForTheYear> findTeamLeaveTrendForTheYear(Long teamId, List<Integer> workingDays,
			List<LocalDate> holidayDates, List<Long> leaveTypeIds, LocalDate startDate, LocalDate endDate);

	/**
	 * The Following query will return approved & pending leave count for the given
	 * employees & teams based on given leave types and the month
	 * @param teamIds ids of the teams which need to be considered
	 * @param workingDays list of the working days in time config
	 * @param holidayDates holiday dates
	 * @param leaveTypeIds leave type ids
	 * @param startDate starting date of the required period
	 * @param endDate end date of the required period
	 * @param employeeIds ids of the employees which need to be considered
	 * @return Employee Ids, month integers and total approved and pending leave request
	 * counts
	 */
	@Query(nativeQuery = true,
			value = """
					SELECT leave_type.type_id AS LeaveType, MONTH(leave_date) AS keyValue,
					COALESCE(SUM(CASE
					WHEN lr.leave_state = 'HALFDAY_MORNING' THEN 0.5
					WHEN lr.leave_state = 'HALFDAY_EVENING' THEN 0.5
					ELSE 1
					END
					), 0) AS leaveRequestCount
					FROM (SELECT ADDDATE(MAKEDATE(YEAR(?5), 1), t2.i*100 + t1.i*10 + t0.i) AS leave_date FROM
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
					) AS v,
					(select distinct l.leave_req_id, l.leave_state, l.start_date, l.end_date, l.type_id
					    from leave_request as l
					    JOIN employee
					    ON l.employee_id = employee.employee_id
					    JOIN user
					    ON l.employee_id = user.user_id
					    JOIN employee_team
					    ON l.employee_id = employee_team.employee_id
					    WHERE (employee_team.team_id in ?1  OR employee.employee_id IN ?7)
					        AND (l.`status` = 'APPROVED' or l.`status` = 'PENDING')
					        AND (NOT (user.`is_active` = '0'))
						) as lr
					JOIN leave_type
					ON lr.type_id = leave_type.type_id
					WHERE (leave_date BETWEEN lr.start_date AND lr.end_date)
					    AND (leave_date BETWEEN ?5 AND ?6)
						AND ((leave_date NOT IN ?3) OR (NOT EXISTS (SELECT 1 FROM holiday WHERE is_active=1)))
						AND ((WEEKDAY(leave_date) IN ?2) OR (NOT EXISTS (SELECT 1 FROM time_config)))
						AND (leave_type.type_id IN ?4)
					GROUP BY keyValue, LeaveType
					ORDER BY keyValue, LeaveType;""")
	List<ManagerLeaveTrend> findLeaveTrendForTheManager(List<Long> teamIds, List<Integer> workingDays,
			List<LocalDate> holidayDates, List<Long> leaveTypeIds, LocalDate startDate, LocalDate endDate,
			List<Long> employeeIds);

	@Query(nativeQuery = true,
			value = """
					     SELECT
					     COALESCE(SUM(CASE\s
					                 WHEN lr.leave_state = 'HALFDAY_MORNING' OR lr.leave_state = 'HALFDAY_EVENING' THEN 0.5
					                 ELSE 1
					                 END), 0) AS leaveRequestDays
					 FROM (SELECT ADDDATE(MAKEDATE(YEAR(?1), 1), t2.i*100 + t1.i*10 + t0.i) AS leaveDate FROM
					 		(SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
					 		(SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
					 		(SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
					 	 ) AS v, leave_request AS lr
					 	                      JOIN employee
					          ON lr.employee_id=employee.employee_id
					          JOIN user
					          ON lr.employee_id = user.user_id
					 WHERE (leaveDate BETWEEN ?1 AND ?2) AND (leaveDate BETWEEN lr.start_date AND lr.end_date) AND ((leaveDate NOT IN ?4) OR (NOT EXISTS (SELECT 1 FROM holiday WHERE is_active=1))) AND ((WEEKDAY(leaveDate) IN ?3) OR (NOT EXISTS (SELECT 1 FROM time_config))) AND lr.`status` IN ('APPROVED', 'PENDING') AND (NOT (user.`is_active` = '0'))
					;
					""")
	Float findAllEmployeeRequestsByDateRangeQuery(LocalDate startDate, LocalDate endDate,
			List<Integer> workingDaysIndex, List<LocalDate> holidayDates);

	/**
	 * The Following query will return approved leave count for the given employees based
	 * on given leave types
	 * @param workingDays indices of the working days in time config
	 * @param holidayDates holiday dates
	 * @param teamId id of the selected team
	 * @return leave type id (Integer) and sum of total leaves (Float) applied by team
	 * members of the selected team grouping by leave type
	 */
	@Query(nativeQuery = true,
			value = """
					SELECT leave_type.type_id AS LeaveType, SUM(CASE
					                                               WHEN lr.leave_state = 'HALFDAY_MORNING' OR lr.leave_state = 'HALFDAY_EVENING' THEN 0.5
					                                               ELSE 1
					                                             END) AS leaveDaysCount
					FROM (SELECT ADDDATE(MAKEDATE(YEAR(?4), 1), t2.i*100 + t1.i*10 + t0.i) AS leave_date FROM
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
					 (SELECT 0 AS i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
					) AS v, leave_request AS lr
					JOIN employee
					ON lr.employee_id=employee.employee_id
					JOIN leave_type
					ON lr.type_id = leave_type.type_id
					JOIN employee_team
					ON lr.employee_id = employee_team.employee_id
					JOIN user
					ON lr.employee_id = user.user_id
					WHERE employee_team.team_id = ?1
					    AND (leave_date BETWEEN lr.start_date AND lr.end_date)
					    AND ((leave_date NOT IN ?3) OR (NOT EXISTS (SELECT 1 FROM holiday WHERE is_active=1)))
					    AND ((WEEKDAY(leave_date) IN ?2) OR (NOT EXISTS (SELECT 1 FROM time_config))) AND (lr.`status` = 'APPROVED' or lr.`status` = 'PENDING')
					    AND (NOT (user.`is_active` = '0')) AND (leave_date BETWEEN ?4 AND ?5)
					GROUP BY LeaveType
					ORDER BY LeaveType;""")
	List<TeamLeaveCountByType> findTeamLeaveCountByType(Long teamId, List<Integer> workingDays,
			List<LocalDate> holidayDates, LocalDate startDate, LocalDate endDate);

}

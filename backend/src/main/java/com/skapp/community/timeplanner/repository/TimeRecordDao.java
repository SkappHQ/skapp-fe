package com.skapp.community.timeplanner.repository;

import com.skapp.community.peopleplanner.model.Employee;
import com.skapp.community.timeplanner.model.TimeRecord;
import com.skapp.community.timeplanner.payload.projection.EmployeeWorkHours;
import com.skapp.community.timeplanner.payload.projection.TimeRecordTrendDto;
import com.skapp.community.timeplanner.payload.projection.TimeRecordsByEmployeesDto;
import com.skapp.community.timeplanner.repository.projection.EmployeeTimeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeRecordDao
		extends JpaRepository<TimeRecord, Long>, JpaSpecificationExecutor<TimeRecord>, TimeRecordRepository {

	/**
	 * Calculates the total count of potential employee time records within a specified
	 * date range, This count represents the number of possible date/employee combinations
	 * where a time record could exist, regardless of whether an actual record is present.
	 * @param employeeId List of employee IDs to filter the results.
	 * @param startDate The start date of the range to search.
	 * @param endDate The end date of the range to search.
	 * @return The total count of potential employee time records.
	 */
	@Query(nativeQuery = true, value = """
			    WITH RECURSIVE date_range AS (
			        SELECT ?2 AS date
			        UNION ALL
			        SELECT DATE_ADD(date, INTERVAL 1 DAY) FROM date_range WHERE date < ?3
			    )
			    SELECT
			        COUNT(*) AS totalCount
			    FROM date_range
			    CROSS JOIN (SELECT DISTINCT employee_id FROM employee WHERE employee_id IN ?1) AS employees
			    LEFT JOIN time_record AS tr
			        ON date_range.date = DATE(tr.date)
			        AND employees.employee_id = tr.employee_id
			    WHERE date_range.date BETWEEN ?2 AND ?3
			""")
	Long getTotalEmployeesTimeRecordCount(List<Long> employeeId, LocalDate startDate, LocalDate endDate);

	/**
	 * Retrieves a paginated list of employee time records within a specified date range,
	 * filtered by working days. Includes details on worked hours and associated time
	 * slots.
	 * @param employeeId List of employee IDs to filter the results.
	 * @param startDate The start date of the range to search.
	 * @param endDate The end date of the range to search.
	 * @param limit The maximum number of records to return.
	 * @param offset The number of records to skip before returning results.
	 * @return A list of EmployeeTimeRecord objects representing the matching time
	 * records.
	 */
	@Query(nativeQuery = true,
			value = """
					    WITH RECURSIVE date_range AS (
					           SELECT ?2 AS date
					           UNION ALL
					           SELECT DATE_ADD(date, INTERVAL 1 DAY) FROM date_range WHERE date < ?3
					        )
					    SELECT
					        COALESCE(tr.time_record_id, null) AS timeRecordId,
					        employees.employee_id as employeeId,
					        CAST(date_range.date AS DATE) AS date,
					        COALESCE(tr.worked_hours, 0.0) AS workedHours,
					        COALESCE(tr.break_hours, 0.0) AS breakHours,
					        IF(COUNT(ts.time_slot_id) > 0, JSON_ARRAYAGG(
					            JSON_OBJECT(
					                'timeSlotId', ts.time_slot_id,
					                'startTime', ts.start_time,
					                'endTime', ts.end_time,
					                'slotType', ts.type,
					                'isActiveRightNow', ts.is_active_now,
					                'isManualEntry', ts.is_manual
					             )
					        ), NULL) AS timeSlots
					    FROM date_range
					    CROSS JOIN (SELECT DISTINCT employee_id, first_name FROM employee WHERE employee_id IN (?1)) AS employees
					    LEFT JOIN time_record AS tr
					       ON date_range.date = DATE(tr.date)
					       AND employees.employee_id = tr.employee_id
					    LEFT JOIN time_slot AS ts
					       ON tr.time_record_id = ts.time_record_id
					    WHERE date_range.date BETWEEN ?2 AND ?3
					    GROUP BY date_range.date, employees.employee_id, tr.time_record_id, employees.first_name
					    ORDER BY date_range.date, employees.first_name
					    LIMIT ?4 OFFSET ?5
					""")
	List<EmployeeTimeRecord> findEmployeesTimeRecords(List<Long> employeeId, LocalDate startDate, LocalDate endDate,
			int limit, long offset);

	Optional<TimeRecord> findByEmployeeAndDate(Employee employee, LocalDate currentDate);

	Optional<TimeRecord> findByTimeRecordIdAndEmployee(Long recordId, Employee employee);

	/**
	 * Retrieves a paginated list of employee time records within a specified date range,
	 * Includes details on worked hours and associated time slots.
	 * @param employeeId List of employee IDs to filter the results.
	 * @param teamIds List of team IDs to filter the results.
	 * @param startDate The start date of the range to search.
	 * @param endDate The end date of the range to search.
	 * @param limit The maximum number of records to return.
	 * @param offset The number of records to skip before returning results.
	 * @return A list of EmployeeTimeRecord objects representing the matching time
	 * records.
	 */
	@Query(nativeQuery = true, value = """
			    WITH RECURSIVE date_range AS (
			           SELECT ?3 AS date
			           UNION ALL
			           SELECT DATE_ADD(date, INTERVAL 1 DAY) FROM date_range WHERE date < ?4
			        )
			    SELECT
			        COALESCE(tr.time_record_id, null) AS timeRecordId,
			        employees.employee_id as employeeId,
			        CAST(date_range.date AS DATE) AS date,
			        COALESCE(ROUND(tr.worked_hours, 2), 0.0) AS workedHours,
			        IF(COUNT(ts.time_slot_id) > 0, JSON_ARRAYAGG(
			            JSON_OBJECT(
			                'timeSlotId', ts.time_slot_id,
			                'startTime', ts.start_time,
			                'endTime', ts.end_time,
			                'slotType', ts.type,
			                'isActiveRightNow', ts.is_active_now,
			                'isManualEntry', ts.is_manual
			             )
			        ), NULL) AS timeSlots
			    FROM date_range
			    CROSS JOIN (
			        SELECT DISTINCT e.employee_id, e.first_name
			        FROM employee e
			        LEFT JOIN employee_team et ON e.employee_id = et.employee_id
			        WHERE e.employee_id IN (?1)
			        AND (et.team_id IN (?2) OR concat(?2) IS NULL)
			    ) AS employees
			    LEFT JOIN time_record AS tr
			       ON date_range.date = DATE(tr.date)
			       AND employees.employee_id = tr.employee_id
			    LEFT JOIN time_slot AS ts
			       ON tr.time_record_id = ts.time_record_id
			    WHERE date_range.date BETWEEN ?3 AND ?4
			    GROUP BY date_range.date, employees.employee_id, tr.time_record_id, employees.first_name
			    ORDER BY date_range.date, employees.first_name
			    LIMIT ?5 OFFSET ?6
			""")
	List<EmployeeTimeRecord> findEmployeesTimeRecordsWithTeams(List<Long> employeeId, List<Long> teamIds,
			LocalDate startDate, LocalDate endDate, int limit, long offset);

	@Query(nativeQuery = true, value = """
			WITH RECURSIVE date_range AS (
			   SELECT ?2 AS date
			   UNION ALL
			   SELECT DATE_ADD(date, INTERVAL 1 DAY) FROM date_range WHERE date < ?3
			)
			select
			    COALESCE(tr.time_record_id, null) AS timeRecordId,
			    CAST(date_range.date AS DATE) AS date,
			    employees.employee_id,
			    COALESCE(tr.worked_hours, 0.0) AS workedHours
			FROM date_range
			CROSS JOIN (SELECT DISTINCT employee_id FROM employee WHERE employee_id in ?1) AS employees
			LEFT JOIN time_record AS tr
			    ON date_range.date = DATE(tr.date)
			    AND employees.employee_id = tr.employee_id
			WHERE date_range.date BETWEEN ?2 AND ?3
			ORDER BY date_range.date
			""")
	List<TimeRecordsByEmployeesDto> getTimeRecordsByEmployees(List<Long> employeeId, LocalDate startDate,
			LocalDate endDate);

	@Query(nativeQuery = true, value = """
			WITH RECURSIVE alldates(date) AS
			(
			    select ?2 as date
			    UNION
			    SELECT DATE_ADD(alldates.date, INTERVAL 1 DAY)
			    FROM alldates
			    WHERE DATE_ADD(alldates.date, INTERVAL 1 DAY) <= ?3
			)
			select CAST(d.date AS DATE) AS Date, COALESCE(tr.worked_hours, 0.0) as WorkedHours
			FROM alldates d
			left join time_record tr on d.date = tr.date and tr.employee_id = ?1
			""")
	List<EmployeeWorkHours> getAllWorkHoursOfEmployee(Long employeeId, LocalDate startDate, LocalDate endDate);

	@Query(nativeQuery = true,
			value = """
					    SELECT
					        TIME_FORMAT(slot_start, '%H:%i') AS slot_start_time,
					        TIME_FORMAT(slot_end, '%H:%i') AS slot_end_time,
					        CONCAT(
					            TIME_FORMAT(slot_start, '%H:%i'),
					            ' - ',
					            TIME_FORMAT(slot_end, '%H:%i')
					        ) AS slot,
					        COALESCE(COUNT(DISTINCT TimeRecords.employee_id), 0) AS count
					    FROM (
					        SELECT
					            TIMESTAMPADD(MINUTE, (t2.i * 150) + t1.i * 30, ?3) AS slot_start,
					            TIMESTAMPADD(MINUTE, (t2.i * 150) + t1.i * 30 + 30, ?3) AS slot_end
					        FROM
					            (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7) t1,
					            (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8) t2
					    ) AS TimeSlots
					    LEFT JOIN (
					        SELECT
					            time_record.clock_in_time,
					            time_record.employee_id,
					            CONVERT_TZ(FROM_UNIXTIME(time_record.clock_in_time / 1000), @@session.time_zone, ?2) AS converted_time
					        FROM
					            time_record
					        WHERE
					            time_record.employee_id IN (
					                SELECT DISTINCT employee_team.employee_id
					                FROM employee_team
					                WHERE employee_team.team_id IN (?1)
					                OR -1 IN (?1)
					            )
					    ) AS TimeRecords
					    ON TimeRecords.converted_time >= TimeSlots.slot_start
					    AND TimeRecords.converted_time < TimeSlots.slot_end
					    GROUP BY
					        slot_start, slot_end
					    ORDER BY
					        slot_start;
					""")
	List<TimeRecordTrendDto> getEmployeeClockInTrend(List<Long> teams, String timeZone, LocalDate date);

	@Query(nativeQuery = true,
			value = """
					    SELECT
					        TIME_FORMAT(slot_start, '%H:%i') AS slot_start_time,
					        TIME_FORMAT(slot_end, '%H:%i') AS slot_end_time,
					        CONCAT(
					            TIME_FORMAT(slot_start, '%H:%i'),
					            ' - ',
					            TIME_FORMAT(slot_end, '%H:%i')
					        ) AS slot,
					        COALESCE(COUNT(DISTINCT TimeRecords.employee_id), 0) AS count
					    FROM (
					        SELECT
					            TIMESTAMPADD(MINUTE, (t2.i * 150) + t1.i * 30, ?3) AS slot_start,
					            TIMESTAMPADD(MINUTE, (t2.i * 150) + t1.i * 30 + 30, ?3) AS slot_end
					        FROM
					            (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7) t1,
					            (SELECT 0 AS i UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8) t2
					    ) AS TimeSlots
					    LEFT JOIN (
					        SELECT
					            time_record.clock_out_time,
					            time_record.employee_id,
					            CONVERT_TZ(FROM_UNIXTIME(time_record.clock_out_time / 1000), @@session.time_zone, ?2) AS converted_time
					        FROM
					            time_record
					        WHERE
					            time_record.employee_id IN (
					                SELECT DISTINCT employee_team.employee_id
					                FROM employee_team
					                WHERE employee_team.team_id IN (?1)
					                OR -1 IN (?1)
					            )
					    ) AS TimeRecords
					    ON TimeRecords.converted_time >= TimeSlots.slot_start
					    AND TimeRecords.converted_time < TimeSlots.slot_end
					    GROUP BY
					        slot_start, slot_end
					    ORDER BY
					        slot_start;
					""")
	List<TimeRecordTrendDto> getEmployeeClockOutTrend(List<Long> teams, String timeZone, LocalDate date);

	TimeRecord findByDateAndEmployee(LocalDate date, Employee employee);

}

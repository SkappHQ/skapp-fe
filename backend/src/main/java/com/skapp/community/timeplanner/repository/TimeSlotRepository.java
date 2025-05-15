package com.skapp.community.timeplanner.repository;

import com.skapp.community.timeplanner.model.TimeSlot;
import com.skapp.community.timeplanner.payload.request.TimeSlotFilterDto;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeSlotRepository {

	/**
	 * Retrieves Time Slots based on the parameters passed inside the filter dto
	 * @param timeSlotFilterDto Object having filter parameters
	 * @return filtered time slots in pageable
	 */
	Page<TimeSlot> getTimeSlotsByTimePeriod(TimeSlotFilterDto timeSlotFilterDto);

	/**
	 * returns list of slots of recordId that is either inside the startTime & endTime or
	 * that are being cut through by startTime or endTime
	 * @param recordId associated with slots
	 * @param startTime slot's startTime
	 * @param endTime slot's startTime
	 * @return list of slots adhering to the condition
	 */
	List<TimeSlot> getFullyAndPartiallyOverlappingSlots(@NotNull Long recordId, @NotNull Long startTime,
			@NotNull Long endTime);

	/**
	 * returns list of slots of recordId that are either outside the startTime & endTime
	 * or that are being cut through by startTime or endTime
	 * @param recordId associated with slots
	 * @param startTime slot's startTime
	 * @param endTime slot's startTime
	 * @return list of slots adhering to the condition
	 */
	List<TimeSlot> getNotFullyOverlappingSlots(@NotNull Long recordId, @NotNull Long startTime, @NotNull Long endTime);

}

package com.skapp.community.timeplanner.payload.request;

import com.skapp.community.timeplanner.type.TimeBlocks;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
public class TimeConfigDto {

	@Valid
	private Set<DayCapacity> dayCapacities;

	public record TimeBlock(@NotNull TimeBlocks timeBlock, @NotNull Float hours) {
	}

	public record DayCapacity(@NotNull DayOfWeek day, @Valid Set<TimeBlock> timeBlocks, @NotNull Float totalHours,
			@NotNull boolean isWeekStartDay, @NotNull LocalTime time) {
	}

}

package com.skapp.community.peopleplanner.repository;

import com.skapp.community.peopleplanner.model.Holiday;
import com.skapp.community.peopleplanner.payload.request.HolidayFilterDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HolidayRepository {

	Page<Holiday> findAllHolidays(HolidayFilterDto holidayFilterDto, Pageable pageable);

}

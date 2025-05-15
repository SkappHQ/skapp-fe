package com.skapp.community.peopleplanner.model;

import com.skapp.community.common.model.Auditable;
import com.skapp.community.peopleplanner.type.HolidayDuration;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "holiday")
public class Holiday extends Auditable<String> {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "date", nullable = false)
	private LocalDate date;

	@Column(name = "name", length = 50, nullable = false)
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(name = "holiday_duration", nullable = false, length = 15, columnDefinition = "varchar(255)")
	private HolidayDuration holidayDuration;

	@Column(name = "is_active")
	private boolean isActive = true;

}

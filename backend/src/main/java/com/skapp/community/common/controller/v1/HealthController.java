package com.skapp.community.common.controller.v1;

import com.skapp.community.common.payload.response.HealthResponse;
import com.skapp.community.common.type.HealthStatus;
import com.skapp.community.common.util.DateTimeUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
public class HealthController {

	@Value("${app.version}")
	private String version;

	@GetMapping("/health")
	public ResponseEntity<HealthResponse> healthCheck() {
		String formattedTimestamp = DateTimeUtils.DATE_TIME_FORMATTER.format(Instant.now());

		HealthResponse health = new HealthResponse(HealthStatus.HEALTHY, formattedTimestamp, version);
		return ResponseEntity.ok(health);
	}

}

package com.skapp.community.common.util.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Converter
public class JsonTypeConverter implements AttributeConverter<JsonNode, String> {

	@Override
	public String convertToDatabaseColumn(JsonNode jsonNode) {
		if (jsonNode == null || jsonNode.isNull()) {
			return null;
		}
		else {
			return jsonNode.toPrettyString();
		}
	}

	@Override
	public JsonNode convertToEntityAttribute(String s) {
		if (s == null || s.isEmpty()) {
			return null;
		}
		else {
			ObjectMapper mapper = new ObjectMapper();
			try {
				return mapper.readTree(s);
			}
			catch (JsonProcessingException e) {
				log.error(
						"[convertToEntityAttribute]: An exception occurred while converting String object to JsonNode object: {}",
						e.getMessage());
				return null;
			}
		}
	}

}

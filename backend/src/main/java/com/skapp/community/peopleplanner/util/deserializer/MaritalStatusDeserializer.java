package com.skapp.community.peopleplanner.util.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.skapp.community.common.exception.ModuleException;
import com.skapp.community.peopleplanner.constant.PeopleMessageConstant;
import com.skapp.community.peopleplanner.type.MaritalStatus;

import java.io.IOException;

public class MaritalStatusDeserializer extends StdDeserializer<MaritalStatus> {

	public MaritalStatusDeserializer() {
		super(MaritalStatus.class);
	}

	@Override
	public MaritalStatus deserialize(JsonParser p, DeserializationContext ctxt) throws ModuleException, IOException {
		JsonNode jsonNode = p.readValueAsTree();
		String value = jsonNode.asText().trim();

		if (jsonNode.isNull() || jsonNode.isMissingNode() || value.isEmpty()) {
			return null;
		}

		try {
			return MaritalStatus.valueOf(value.toUpperCase());
		}
		catch (IllegalArgumentException e) {
			throw new ModuleException(PeopleMessageConstant.PEOPLE_ERROR_INVALID_VALUE_FOR_MARITAL_STATUS_ENUM,
					new String[] { value });
		}
	}

}

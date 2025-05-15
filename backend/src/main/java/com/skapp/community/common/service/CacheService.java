package com.skapp.community.common.service;

import java.util.concurrent.TimeUnit;

public interface CacheService {

	String get(String cacheKey);

	void put(String cacheKey, String value, long ttl, TimeUnit timeUnit);

	void invalidate(String cacheKey);

}

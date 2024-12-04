import { DateTime } from "luxon";

import {
  convertTo24HourByDateString,
  convertToDateTime,
  convertToMilliseconds,
  convertToTimeZoneISO,
  convertToUtc,
  convertUnixTimestampToISO,
  formatDuration,
  generateTimeSlots,
  getDayStartTimeEndTime,
  getTimeDifference,
  isToday,
  timeStringToDecimalHours,
  timeStringToSeconds
} from "../TimeUtils";

describe("Date and Time Utility Functions", () => {
  test("convertTo24HourByDateString", () => {
    expect(convertTo24HourByDateString("2023-11-03T14:30:00")).toBe("14:30");
  });

  test("convertUnixTimestampToISO", () => {
    const unixTimestamp = 1672444800000;
    const isoString = DateTime.fromMillis(unixTimestamp).toISO({
      includeOffset: false
    });
    expect(convertUnixTimestampToISO(unixTimestamp)).toBe(isoString);
  });

  test("generateTimeSlots", () => {
    const timeSlots = generateTimeSlots();
    expect(timeSlots.length).toBe(25);
    expect(timeSlots[0]).toBe("00:00");
    expect(timeSlots[24]).toBe("00:00");
  });

  test("timeStringToDecimalHours", () => {
    expect(timeStringToDecimalHours("02:30:00")).toBeCloseTo(2.5);
  });

  test("formatDuration", () => {
    expect(formatDuration(2.5)).toBe("2h 30m");
  });

  describe("isToday", () => {
    test("returns true for today's date (full ISO string)", () => {
      const todayISO = DateTime.local().toISO(); // Full ISO string with time
      expect(isToday(todayISO)).toBe(true);
    });

    test("returns true for today's date (YYYY-MM-DD format)", () => {
      const todayISODate = DateTime.local().toISODate(); // YYYY-MM-DD format
      expect(isToday(todayISODate)).toBe(true);
    });

    test("returns false for a past date", () => {
      expect(isToday("2000-01-01")).toBe(false);
    });

    test("returns false for a future date", () => {
      const futureDate = DateTime.local().plus({ days: 1 }).toISO(); // Tomorrow's date
      expect(isToday(futureDate)).toBe(false);
    });

    test("handles invalid date strings gracefully", () => {
      expect(isToday("invalid-date")).toBe(false); // Invalid input
    });
  });

  test("getDayStartTimeEndTime", () => {
    const { dayStart, dayEnd } = getDayStartTimeEndTime();
    const currentDay = DateTime.local().toISODate();
    expect(dayStart.startsWith(currentDay)).toBe(true);
    expect(dayEnd.startsWith(currentDay)).toBe(true);
  });

  test("timeStringToSeconds", () => {
    expect(timeStringToSeconds("01:30")).toBe(5400);
  });

  test("getTimeDifference", () => {
    const startTime = "2023-11-03T10:00:00";
    const endTime = "2023-11-03T12:00:00";
    expect(getTimeDifference(startTime, endTime)).toBe(7200);
  });

  test("convertToUtc", () => {
    const localTime = new Date(Date.UTC(2023, 10, 3, 12, 0, 0)).toISOString();
    expect(convertToUtc(localTime)).toBe("2023-11-03T12:00:00.000Z");
  });

  test("convertToMilliseconds", () => {
    const timeString = "2023-11-03T12:00:00";
    const milliseconds = DateTime.fromISO(timeString, {
      zone: "Asia/Colombo"
    })
      .toUTC()
      .toMillis();

    expect(convertToMilliseconds(timeString)).toBe(milliseconds);
  });

  test("convertToDateTime", () => {
    const expectedDateTime = DateTime.fromFormat(
      "2023-11-03 12:00 PM",
      "yyyy-MM-dd hh:mm a",
      { zone: "Asia/Colombo" }
    ).toISO();

    const result = convertToDateTime("2023-11-03", "12:00 PM");
    expect(result).toBe(expectedDateTime);
  });

  test("convertToTimeZoneISO", () => {
    const isoTime = "2023-11-03T12:00:00Z";
    const expectedTime = DateTime.fromISO(isoTime)
      .setZone("Asia/Colombo")
      .toISO();
    expect(convertToTimeZoneISO(isoTime)).toBe(expectedTime);
  });
});

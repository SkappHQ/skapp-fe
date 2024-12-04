import { formatToFiveDecimalPlaces } from "~community/common/utils/numberUtils";

describe("formatToFiveDecimalPlaces", () => {
  it("should format number to 5 decimal places", () => {
    expect(formatToFiveDecimalPlaces(123.456789)).toBe("123.45679");
  });

  it("should handle numbers with less than 5 decimal places", () => {
    expect(formatToFiveDecimalPlaces(123.4)).toBe("123.4");
  });

  it("should handle whole numbers", () => {
    expect(formatToFiveDecimalPlaces(123)).toBe("123");
  });

  it("should handle negative numbers", () => {
    expect(formatToFiveDecimalPlaces(-123.456789)).toBe("-123.45679");
  });

  it("should handle zero", () => {
    expect(formatToFiveDecimalPlaces(0)).toBe("0");
  });

  it("should remove trailing zero after decimal point", () => {
    expect(formatToFiveDecimalPlaces(10.0)).toBe("10");
  });

  it("should handle very small numbers", () => {
    expect(formatToFiveDecimalPlaces(0.00000123456789)).toBe("0");
  });
});

import { DropdownListType } from "~community/common/types/CommonTypes";

import { handleMultipleSelectedValues } from "../inputSelectHandler";

describe("handleMultipleSelectedValues", () => {
  const itemList: DropdownListType[] = [
    { value: 1, label: "Item 1" },
    { value: 2, label: "Item 2" },
    { value: 3, label: "Item 3" }
  ];

  it("should return an empty array when no values are provided", () => {
    const result = handleMultipleSelectedValues([], itemList);
    expect(result).toEqual([]);
  });

  it("should return the correct item details when all values exist in itemList", () => {
    const values = [1, 2];
    const result = handleMultipleSelectedValues(values, itemList);
    expect(result).toEqual([
      { value: 1, label: "Item 1" },
      { value: 2, label: "Item 2" }
    ]);
  });

  it("should return only the matching items from itemList when some values exist", () => {
    const values = [1, 4];
    const result = handleMultipleSelectedValues(values, itemList);
    expect(result).toEqual([{ value: 1, label: "Item 1" }]);
  });

  it("should return an empty array when no values match itemList", () => {
    const values = [5, 6];
    const result = handleMultipleSelectedValues(values, itemList);
    expect(result).toEqual([]);
  });
});

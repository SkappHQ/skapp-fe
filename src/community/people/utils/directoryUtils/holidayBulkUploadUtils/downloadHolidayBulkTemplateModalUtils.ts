import { createCSV } from "~community/common/utils/bulkUploadUtils";
import { currentYear } from "~community/common/utils/dateTimeUtils";
import {
  HolidayDurationType,
  holidayType
} from "~community/people/types/HolidayTypes";

const getDummyHolidayCsvData = (): holidayType[] => {
  return [
    {
      date: `${currentYear}-04-14`,
      name: "New year",
      holidayDuration: HolidayDurationType.FULLDAY
    },
    {
      date: `${currentYear}-04-15`,
      name: "New year Eve",
      holidayDuration: HolidayDurationType.HALFDAY_EVENING
    }
  ];
};

export const downloadBulkCsvTemplate = () => {
  const headers = ["Date", "Name", "Holiday Duration"];

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(headers.join(",") + "\n");
      for (const holidayDetails of getDummyHolidayCsvData()) {
        const rowData = [
          holidayDetails?.date,
          holidayDetails?.name,
          holidayDetails?.holidayDuration
        ];
        controller.enqueue(rowData.join(",") + "\n");
      }

      controller.close();
    }
  });

  createCSV(stream, "HolidayBulkTemplate");
};

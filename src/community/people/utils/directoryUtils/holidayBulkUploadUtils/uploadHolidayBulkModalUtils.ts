import { parse } from "papaparse";
import { Dispatch, SetStateAction } from "react";

import {
  HolidayCSVHeader,
  HolidayTableHeader
} from "~community/common/constants/stringConstants";
import { type FileUploadType } from "~community/common/types/CommonTypes";
import { HolidayDataType } from "~community/people/types/HolidayTypes";
import { normalizeHolidayDates } from "~community/people/utils/holidayUtils/holidayDateValidation";

const isArrayOfTypeHoliday = (holidayArray: HolidayDataType[]) =>
  Array.isArray(holidayArray) &&
  holidayArray.every((holiday) => {
    return (
      typeof holiday.date === "string" &&
      holiday.date &&
      typeof holiday.name === "string" &&
      holiday.name &&
      typeof holiday.holidayDuration === "string" &&
      holiday.holidayDuration
    );
  });

const removeEmptyColumns = (tableData: HolidayDataType[]) =>
  tableData.reduce((acc, row) => {
    if (row.holidayType !== "") {
      const { date, name, holidayDuration } = row;
      acc = [...acc, { date, name, holidayDuration }];
    }
    return acc;
  }, []);

const convertCsvHeaders = (header: string) => {
  if (header === HolidayTableHeader.DATE) {
    return HolidayCSVHeader.DATE;
  } else if (header === HolidayTableHeader.NAME) {
    return HolidayCSVHeader.NAME;
  } else if (header === HolidayTableHeader.HOLIDAY_DURATION) {
    return HolidayCSVHeader.HOLIDAY_DURATION;
  }
  return header;
};

const validateHeaders = async (file: File): Promise<boolean> => {
  const readCSVHeaders = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event?.target?.result as string;

        const headers = text
          .split("\n")[0]
          .split(",")
          .map((header) => header.trim());
        resolve(headers);
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsText(file);
    });
  };

  const includesInvalidHeaders = (headers: string[]): boolean => {
    const predefinedHeaders = ["Date", "Name", "Holiday Duration"];
    return headers?.some((header) => !predefinedHeaders?.includes(header));
  };

  const headers = await readCSVHeaders(file);

  const isValid = !includesInvalidHeaders(headers);

  return isValid;
};

export const setAttachment = async ({
  acceptedFiles,
  translateText,
  setValid,
  setCustomError,
  setCalendarAttachments,
  setHolidayBulkList,
  setNewCalendarDetails
}: {
  acceptedFiles: FileUploadType[];
  setCalendarAttachments: (value: SetStateAction<FileUploadType[]>) => void;
  setCustomError: Dispatch<SetStateAction<string>>;
  setValid: Dispatch<SetStateAction<boolean>>;
  translateText: (keys: string[]) => string;
  setHolidayBulkList: Dispatch<SetStateAction<HolidayDataType[]>>;
  setNewCalendarDetails: (key: string, value: any) => void;
}): Promise<void> => {
  setCalendarAttachments(acceptedFiles);
  setCustomError("");
  setValid(false);

  if (acceptedFiles?.length > 0) {
    const areHeadersValid = await validateHeaders(
      acceptedFiles[0].file ?? new File([], "")
    );

    if (areHeadersValid) {
      parse(acceptedFiles?.[0].file as File, {
        header: true,
        skipEmptyLines: true,
        transformHeader: convertCsvHeaders,
        complete: function (recordDetails) {
          if (recordDetails?.data?.length === 0) {
            setCustomError(translateText(["emptyFileError"]));
          } else {
            const holidays = removeEmptyColumns(
              recordDetails.data as HolidayDataType[]
            );

            if (isArrayOfTypeHoliday(holidays) && holidays.length > 0) {
              const validHolidays = normalizeHolidayDates(holidays);

              const isHeadersValid = validateHeaders(
                acceptedFiles[0].file as File
              );

              if (!validHolidays || !isHeadersValid) {
                setValid(false);
              } else {
                if (setNewCalendarDetails) {
                  setNewCalendarDetails("acceptedFile", acceptedFiles);
                }
                setHolidayBulkList(validHolidays);
                setValid(true);
              }
            } else {
              setValid(false);
            }
          }
        }
      });
    } else {
      setCustomError(translateText(["invalidTemplateError"]));
    }
  } else {
    if (setNewCalendarDetails) {
      setNewCalendarDetails("acceptedFile", acceptedFiles);
    }
    setCalendarAttachments([]);
  }
};

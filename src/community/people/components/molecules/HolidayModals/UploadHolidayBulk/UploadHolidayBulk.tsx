import { Box, Typography } from "@mui/material";
import { parse } from "papaparse";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import CloseIcon from "~community/common/assets/Icons/CloseIcon";
import RightArrowIcon from "~community/common/assets/Icons/RightArrowIcon";
import Button from "~community/common/components/atoms/Button/Button";
import DragAndDropField from "~community/common/components/molecules/DragAndDropField/DragAndDropField";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { theme } from "~community/common/theme/theme";
import {
  type FileRejectionType,
  type FileUploadType
} from "~community/common/types/CommonTypes";
import {
  convertCsvHeaders,
  removeEmptyColumns
} from "~community/common/utils/commonUtil";
import { useAddBulkHolidays } from "~community/people/api/HolidayApi";
import { usePeopleStore } from "~community/people/store/store";
import {
  type HolidayDataType as Holiday,
  holidayBulkUploadResponse,
  holidayModalTypes
} from "~community/people/types/HolidayTypes";
import { normalizeHolidayDates } from "~community/people/utils/holidayUtils/holidayDateValidation";
import { validateHeaders } from "~community/people/utils/holidayUtils/validateHeaders";

interface Props {
  setBulkUploadData: Dispatch<
    SetStateAction<holidayBulkUploadResponse | undefined>
  >;
}

const UploadHolidayBulk: FC<Props> = ({ setBulkUploadData }) => {
  const [attachmentError, setAttachmentError] = useState(false);
  const [calendarAttachments, setCalendarAttachments] = useState<
    FileUploadType[]
  >([]);
  const {
    newCalenderDetails,
    holidayModalType,
    setNewCalendarDetails = () => {},
    setHolidayModalType,
    resetHolidayDetails,
    selectedYear,
    setIsBulkUpload
  } = usePeopleStore((state) => state);

  const { setIsHolidayModalOpen, setFailedCount } = usePeopleStore(
    (state) => state
  );

  const [isInvalidFileError, setIsInvalidFileError] = useState<boolean>(false);
  const [holidayBulkList, setHolidayBulkList] = useState<Holiday[]>([]);
  const translateText = useTranslator("peopleModule", "holidays");
  const { setToastMessage } = useToast();
  const onSuccess = (response: holidayBulkUploadResponse): void => {
    setBulkUploadData(response);
    if (response.bulkStatusSummary.failedCount > 0) {
      setHolidayModalType(holidayModalTypes.UPLOAD_SUMMARY);
      setFailedCount(response.bulkStatusSummary.failedCount);
      setIsHolidayModalOpen(true);
      if (response.bulkStatusSummary.successCount > 0)
        setToastMessage({
          title: translateText(["uploadSuccessfully"]),
          description: translateText(["holidayCreateSuccessToastDes"], {
            NumberOfHolidays: response.bulkStatusSummary.successCount
          }),
          isIcon: true,
          toastType: ToastType.SUCCESS,
          open: true
        });
      else {
        setToastMessage({
          title: translateText(["uploadFailed"]),
          description: translateText(["uploadFailedDes"]),
          isIcon: true,
          toastType: ToastType.ERROR,
          open: true
        });
      }
    } else {
      setHolidayModalType(holidayModalTypes.NONE);
      setIsHolidayModalOpen(false);
      setToastMessage({
        title: translateText(["holidayCreateSuccessToastTitle"], {
          SelectedYear: selectedYear
        }),
        description: translateText(["holidayCreateSuccessToastDes"], {
          NumberOfHolidays: response.bulkStatusSummary.successCount
        }),
        isIcon: true,
        toastType: ToastType.SUCCESS,
        open: true
      });
    }
    setHolidayBulkList([]);
    setCalendarAttachments([]);
  };

  const onError = (): void => {
    setIsHolidayModalOpen(false);
    setToastMessage({
      title: translateText(["holidayCreateFailTitle"]),
      description: translateText(["holidayCreateFailDes"]),
      isIcon: true,
      toastType: ToastType.ERROR,
      open: true
    });
  };
  const { mutate } = useAddBulkHolidays(onSuccess, onError);

  useEffect(() => {
    setCalendarAttachments(newCalenderDetails?.acceptedFile);
    setIsBulkUpload(true);
  }, [newCalenderDetails?.acceptedFile]);

  const isArrayOfTypeHoliday = (holidayArray: Holiday[]) =>
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
  const setAttachment = async (
    acceptedFiles: FileUploadType[]
  ): Promise<void> => {
    setIsInvalidFileError(false);
    if (acceptedFiles?.[0]?.file) {
      parse(acceptedFiles[0].file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: convertCsvHeaders,
        complete: function (results) {
          const holidays = removeEmptyColumns(results.data as Holiday[]);

          if (results.data.length === 0) {
            setToastMessage({
              title: translateText(["noRecordCSVTitle"]),
              description: translateText(["noRecordCSVDes"]),
              isIcon: true,
              toastType: ToastType.ERROR,
              open: true
            });
            return;
          }

          if (isArrayOfTypeHoliday(holidays) && holidays.length > 0) {
            const validHolidays = normalizeHolidayDates(holidays);

            const isHeadersValid = validateHeaders(
              acceptedFiles[0].file as File
            );

            if (!validHolidays || !isHeadersValid) {
              setIsInvalidFileError(true);
              return;
            }

            setHolidayBulkList(validHolidays);

            if (setNewCalendarDetails) {
              setNewCalendarDetails("acceptedFile", acceptedFiles);
            }

            setIsInvalidFileError(false);
          } else {
            setIsInvalidFileError(true);
          }
        }
      });
    } else {
      if (setNewCalendarDetails) {
        setNewCalendarDetails("acceptedFile", acceptedFiles);
      }
    }
  };

  const handleSaveCalendarBtn = (): void => {
    mutate({ holidayData: holidayBulkList, selectedYear });
    setIsHolidayModalOpen(false);
    setNewCalendarDetails("acceptedFile", []);
    setCalendarAttachments([]);
  };

  const onCloseClick = () => {
    if (
      calendarAttachments?.length !== 0 &&
      holidayModalType === holidayModalTypes.UPLOAD_HOLIDAY_BULK
    ) {
      setHolidayModalType(holidayModalTypes.HOLIDAY_EXIT_CONFIRMATION);
    } else {
      setIsHolidayModalOpen(false);
      setHolidayModalType(holidayModalTypes.NONE);
      resetHolidayDetails();
    }
  };
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: "1rem",
          marginTop: "1rem",
          marginBottom: "0.5rem"
        }}
      >
        {translateText(["addCsvTitle"])}
      </Typography>
      <DragAndDropField
        isDisableColor={true}
        setAttachmentErrors={(errors: FileRejectionType[]) => {
          setAttachmentError(!!errors?.length);
        }}
        setAttachments={(acceptedFiles: FileUploadType[]) => {
          setCalendarAttachments(acceptedFiles);
          setAttachment(acceptedFiles);
        }}
        accept={{
          "text/csv": [".csv"]
        }}
        uploadableFiles={calendarAttachments}
        supportedFiles={".csv"}
        maxFileSize={1}
        isZeroFilesErrorRequired={false}
        descriptionStyles={{ color: theme.palette.grey[700] }}
        browseTextStyles={{ color: theme.palette.grey[700] }}
      />
      {calendarAttachments?.[0]?.file &&
        isInvalidFileError &&
        !attachmentError && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.error.contrastText, mt: 1 }}
          >
            {translateText(["csvTemplateError"])}
          </Typography>
        )}
      <Button
        disabled={
          attachmentError ||
          !(calendarAttachments?.length > 0) ||
          isInvalidFileError
        }
        label={translateText(["UploadHolidays"])}
        endIcon={<RightArrowIcon />}
        buttonStyle={ButtonStyle.PRIMARY}
        styles={{ mt: "1rem" }}
        onClick={() => handleSaveCalendarBtn()}
        // TODO: Remove if not needed
        // textStyles={{
        //   color:
        //     attachmentError ||
        //     !(calendarAttachments?.length > 0) ||
        //     isInvalidFileError
        //       ? theme.palette.grey[800]
        //       : theme.palette.primary.contrastText
        // }}
      />
      <Button
        label={translateText(["cancelBtnText"])}
        endIcon={<CloseIcon />}
        buttonStyle={ButtonStyle.TERTIARY}
        styles={{ mt: "1rem" }}
        onClick={onCloseClick}
      />
    </Box>
  );
};

export default UploadHolidayBulk;

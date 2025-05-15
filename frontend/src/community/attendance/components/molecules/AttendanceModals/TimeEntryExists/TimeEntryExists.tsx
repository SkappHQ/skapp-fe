import { Typography } from "@mui/material";

import { useAddManualTimeEntry } from "~community/attendance/api/AttendanceEmployeeApi";
import { EmployeeTimesheetModalTypes } from "~community/attendance/enums/timesheetEnums";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import {
  convertToUtc,
  getCurrentTimeZone
} from "~community/attendance/utils/TimeUtils";
import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";

interface Props {
  fromDateTime: string;
  toDateTime: string;
}

const TimeEntryExists = ({ fromDateTime, toDateTime }: Props) => {
  const translateText = useTranslator("attendanceModule", "timesheet");
  const { setIsEmployeeTimesheetModalOpen, setEmployeeTimesheetModalType } =
    useAttendanceStore((state) => state);
  const { setToastMessage } = useToast();

  const onSuccess = () => {
    setToastMessage({
      open: true,
      title: translateText(["addTimeEntrySuccessTitle"]),
      description: translateText(["addTimeEntrySuccessDes"]),
      toastType: ToastType.SUCCESS
    });
  };

  const onError = () => {
    setToastMessage({
      open: true,
      title: translateText(["addTimeEntryErrorTitle"]),
      description: translateText(["addTimeEntryErrorDes"]),
      toastType: ToastType.ERROR
    });
  };

  const { mutate: manualEntryMutate } = useAddManualTimeEntry(
    onSuccess,
    onError
  );

  const handleSubmit = () => {
    manualEntryMutate({
      startTime: convertToUtc(fromDateTime) as string,
      endTime: convertToUtc(toDateTime) as string,
      zoneId: getCurrentTimeZone()
    });
    setIsEmployeeTimesheetModalOpen(false);
  };
  return (
    <>
      <Typography variant="body1" sx={{ pt: "1rem" }}>
        {translateText(["entryExistModalDes"])}
      </Typography>
      <Button
        label={translateText(["confirmBtnTxt"])}
        styles={{
          mt: "1rem"
        }}
        buttonStyle={ButtonStyle.PRIMARY}
        endIcon={IconName.CHECK_ICON}
        onClick={handleSubmit}
      />
      <Button
        label={translateText(["cancelBtnTxt"])}
        styles={{
          mt: "1rem"
        }}
        buttonStyle={ButtonStyle.TERTIARY}
        endIcon={IconName.CLOSE_ICON}
        onClick={() => {
          setIsEmployeeTimesheetModalOpen(true);
          setEmployeeTimesheetModalType(
            EmployeeTimesheetModalTypes.ADD_TIME_ENTRY
          );
        }}
      />
    </>
  );
};

export default TimeEntryExists;

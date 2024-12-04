import { Typography } from "@mui/material";

import { EmployeeTimesheetModalTypes } from "~community/attendance/enums/timesheetEnums";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

interface Props {
  isEdit: boolean;
}

const TimeEntryRequestExists = ({ isEdit }: Props) => {
  const translateText = useTranslator("attendanceModule", "timesheet");
  const { setIsEmployeeTimesheetModalOpen, setEmployeeTimesheetModalType } =
    useAttendanceStore((state) => state);
  return (
    <>
      <Typography variant="body1" sx={{ pt: "1rem" }}>
        {translateText(["requestExistModalDes"])}
      </Typography>
      <Button
        label={translateText(["okayBtnTxt"])}
        styles={{
          mt: "1rem"
        }}
        buttonStyle={ButtonStyle.PRIMARY}
        endIcon={IconName.CHECK_ICON}
        onClick={() => {
          if (isEdit) {
            setIsEmployeeTimesheetModalOpen(false);
          } else {
            setIsEmployeeTimesheetModalOpen(true);
            setEmployeeTimesheetModalType(
              EmployeeTimesheetModalTypes.ADD_TIME_ENTRY
            );
          }
        }}
      />
    </>
  );
};

export default TimeEntryRequestExists;

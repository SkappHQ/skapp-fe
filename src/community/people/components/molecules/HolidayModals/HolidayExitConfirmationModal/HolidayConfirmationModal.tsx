import { Box, Typography } from "@mui/material";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { usePeopleStore } from "~community/people/store/store";
import { holidayModalTypes } from "~community/people/types/HolidayTypes";

const HolidayExitConfirmationModal = () => {
  const translateText = useTranslator("peopleModule", "holidays");

  const {
    isBulkUpload,
    setHolidayModalType,
    setIsHolidayModalOpen,
    resetHolidayDetails,
    removeAddedCalendarDetails
  } = usePeopleStore((state) => ({
    isBulkUpload: state.isBulkUpload,
    setHolidayModalType: state.setHolidayModalType,
    setIsHolidayModalOpen: state.setIsHolidayModalOpen,
    resetHolidayDetails: state.resetHolidayDetails,
    removeAddedCalendarDetails: state.removeAddedCalendarDetails
  }));

  const resumeTaskHandler = () => {
    if (isBulkUpload) {
      setHolidayModalType(holidayModalTypes.UPLOAD_HOLIDAY_BULK);
    } else {
      setHolidayModalType(holidayModalTypes.ADD_EDIT_HOLIDAY);
    }
  };

  const leaveBtnOnClick = () => {
    setHolidayModalType(holidayModalTypes.NONE);
    setIsHolidayModalOpen(false);

    if (isBulkUpload) {
      removeAddedCalendarDetails();
    } else {
      resetHolidayDetails();
    }
  };

  return (
    <Box>
      <Typography sx={{ mt: "1rem" }}>
        {translateText(["deletionConfirmDescription"])}
      </Typography>
      <Box>
        <Button
          label={translateText(["deletionConfirmResumeBtn"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.PRIMARY}
          onClick={resumeTaskHandler}
        />
        <Button
          label={translateText(["deletionConfirmLeaveAnywayBtn"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.ERROR}
          onClick={leaveBtnOnClick}
        />
      </Box>
    </Box>
  );
};

export default HolidayExitConfirmationModal;

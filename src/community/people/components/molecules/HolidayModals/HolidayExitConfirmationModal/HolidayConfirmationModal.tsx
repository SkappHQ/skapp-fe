import { Box, Typography } from "@mui/material";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { usePeopleStore } from "~community/people/store/store";
import { holidayModalTypes } from "~community/people/types/HolidayTypes";

const HolidayExitConfirmationModal = () => {
  const translateText = useTranslator("peopleModule", "holidays");
  const {
    setHolidayModalType,
    setIsHolidayModalOpen,
    resetHolidayDetails,
    setNewCalendarDetails = () => {},
    isBulkUpload
  } = usePeopleStore((state) => state);

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
    resetHolidayDetails();
    setNewCalendarDetails("acceptedFile", []);
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

import { Box, Divider, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import DownSideArrow from "~community/common/assets/Icons/DownSideArrow";
import RightArrowIcon from "~community/common/assets/Icons/RightArrowIcon";
import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { usePeopleStore } from "~community/people/store/store";
import {
  holidayBulkUploadResponse,
  holidayModalTypes,
  holidayType
} from "~community/people/types/HolidayTypes";
import { downloadBulkCsvTemplate } from "~community/people/utils/holidayUtils/commonUtils";
import HolidayDummyData from "~community/people/utils/holidayUtils/holidayDummyData.json";
import { useCommonEnterpriseStore } from "~enterprise/common/store/commonStore";

interface Props {
  setBulkUploadData: Dispatch<
    SetStateAction<holidayBulkUploadResponse | undefined>
  >;
}

const AddCalendar: FC<Props> = ({ setBulkUploadData }) => {
  const { setHolidayModalType, setIsBulkUpload } = usePeopleStore(
    (state) => state
  );

  const { ongoingQuickSetup } = useCommonEnterpriseStore((state) => ({
    ongoingQuickSetup: state.ongoingQuickSetup
  }));

  const [isDownloadBlinking, setIsDownloadBlinking] = useState(false);
  const [isNextBlinking, setIsNextBlinking] = useState(false);

  useEffect(() => {
    if (ongoingQuickSetup.SETUP_HOLIDAYS) {
      setIsDownloadBlinking(true);
    }
  }, [ongoingQuickSetup]);

  const translateText = useTranslator("peopleModule", "holidays");

  const downloadTemplateHandler = (): void => {
    downloadBulkCsvTemplate(HolidayDummyData as holidayType[]);
    setIsBulkUpload(true);
    if (ongoingQuickSetup.SETUP_HOLIDAYS) {
      setIsDownloadBlinking(false);
      setIsNextBlinking(true);
    }
  };

  return (
    <Box>
      <Box>
        <Typography
          variant="body1"
          sx={{
            py: "1rem",
            borderRadius: "0.75rem"
          }}
        >
          {translateText(["downloadCsvDes"])}
        </Typography>
        <Button
          label={translateText(["downloadCsvTitle"])}
          buttonStyle={ButtonStyle.SECONDARY}
          styles={{ my: "0.75rem" }}
          endIcon={<DownSideArrow />}
          onClick={downloadTemplateHandler}
          shouldBlink={isDownloadBlinking}
        />
      </Box>
      <Divider />
      <Button
        label="Next"
        endIcon={<RightArrowIcon />}
        buttonStyle={ButtonStyle.PRIMARY}
        styles={{ mt: "0.75rem" }}
        onClick={() =>
          setHolidayModalType(holidayModalTypes.UPLOAD_HOLIDAY_BULK)
        }
        shouldBlink={isNextBlinking}
      />
    </Box>
  );
};

export default AddCalendar;

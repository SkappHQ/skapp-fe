import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

import styles from "./styles";

interface Props {
  closeModal: () => void;
}

const PreMidnightClockOutAlertModal: FC<Props> = ({ closeModal }) => {
  const translateText = useTranslator("attendanceModule", "timeWidget");
  const classes = styles();
  const handleOkay = (): void => {
    closeModal();
  };

  return (
    <>
      <Box component="div">
        <Box component="div" sx={classes.headerContainer}>
          <Typography
            id="modal-title"
            variant="h5"
            align="center"
            sx={classes.headerText}
          >
            {translateText(["clockOutAlert"])}
          </Typography>
        </Box>
        <Box sx={classes.bodyContainer}>
          <Typography variant="body2" sx={classes.bodyText}>
            {translateText(["clockOutAlertMessage"])}
          </Typography>
          <Stack spacing={2}>
            <Button
              label={translateText(["ok"])}
              endIcon={IconName.CHECK_ICON}
              onClick={handleOkay}
              ariaLabel={translateText(["ok"])}
            />
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default PreMidnightClockOutAlertModal;

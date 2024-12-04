import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { JSX } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import {
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useLeaveCarryForward } from "~community/leave/api/LeaveApi";
import { useLeaveStore } from "~community/leave/store/store";

interface Props {
  handleClose: () => void;
}

const LeaveCarryForwardSyncConfirmation = ({
  handleClose
}: Props): JSX.Element => {
  const { leaveCarryForwardId } = useLeaveStore((state) => state);
  const { setToastMessage } = useToast();
  const handleCarryForward = () => {
    mutate(leaveCarryForwardId);
  };

  const translateTexts = useTranslator("leaveModule", "leaveCarryForward");

  const onSuccess = () => {
    setToastMessage({
      open: true,
      toastType: "success",
      title: translateTexts(["leaveCarryForwardSuccessToastTitle"]),
      description: translateTexts(["leaveCarryForwardSuccessToastDescription"]),
      isIcon: true
    });
    handleClose();
  };

  const onError = () => {
    setToastMessage({
      open: true,
      toastType: "error",
      title: translateTexts(["leaveCarryForwardFailToastTitle"]),
      description: translateTexts(["leaveCarryForwardFailToastDescription"]),
      isIcon: true
    });
  };

  const { mutate } = useLeaveCarryForward(onSuccess, onError);

  return (
    <Stack
      sx={{
        minWidth: "31.25rem"
      }}
    >
      <Typography
        sx={{
          my: "1rem",
          color: "grey.900",
          width: "100%"
        }}
        variant="body1"
      >
        {translateTexts(["leaveCarryForwardModalDescription"]) ?? ""}
      </Typography>
      <Box>
        <Button
          label={translateTexts(["leaveCarryForwardModalConfirmSyncBtn"])}
          endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
          type={ButtonTypes.SUBMIT}
          onClick={handleCarryForward}
        />
        <Button
          buttonStyle={ButtonStyle.TERTIARY}
          styles={{ mt: "1rem" }}
          type={ButtonTypes.BUTTON}
          label={translateTexts(["leaveCarryForwardModalCancelBtn"])}
          endIcon={<Icon name={IconName.CLOSE_ICON} />}
          onClick={handleClose}
        />
      </Box>
    </Stack>
  );
};

export default LeaveCarryForwardSyncConfirmation;

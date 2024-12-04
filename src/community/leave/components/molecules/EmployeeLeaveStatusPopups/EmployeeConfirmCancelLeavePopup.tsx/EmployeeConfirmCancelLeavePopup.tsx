import { Box, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC, useEffect } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useCancelLeaveRequest } from "~community/leave/api/MyRequestApi";
import { useLeaveStore } from "~community/leave/store/store";
import { EmployeeLeaveStatusPopupTypes } from "~community/leave/types/EmployeeLeaveRequestTypes";

interface Props {
  setPopupType: (type: EmployeeLeaveStatusPopupTypes) => void;
}

const EmployeeConfirmCancelLeavePopup: FC<Props> = ({ setPopupType }) => {
  const theme: Theme = useTheme();
  const { employeeLeaveRequestData } = useLeaveStore((state) => state);
  const { setToastMessage } = useToast();
  const translateText = useTranslator("leaveModule", "myRequests");
  const {
    mutate: employeeCancelLeaveRequest,
    isSuccess: isCancellationSuccess,
    isError: isCancellationError
  } = useCancelLeaveRequest();

  useEffect(() => {
    if (isCancellationSuccess) {
      setPopupType(EmployeeLeaveStatusPopupTypes.CANCELLED_SUMMARY);
      setToastMessage({
        open: true,
        title: translateText(["myLeaveRequests", "leaveCancelSuccessTitle"]),
        description: translateText([
          "myLeaveRequests",
          "leaveCancelSuccessDescription"
        ]),
        toastType: ToastType.SUCCESS
      });
    }
    if (isCancellationError) {
      setToastMessage({
        open: true,
        title: translateText(["myLeaveRequests", "leaveCancelErrorTitle"]),
        description: translateText([
          "myLeaveRequests",
          "leaveCancelErrorDescription"
        ]),
        toastType: ToastType.ERROR
      });
    }
  }, [isCancellationSuccess, isCancellationError]);

  const handleCancelLeave = (): void => {
    const data = { id: employeeLeaveRequestData?.leaveRequestId };
    employeeCancelLeaveRequest(data);
  };

  return (
    <>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.grey[400],
          marginTop: "1rem"
        }}
        tabIndex={0}
      >
        {translateText(["myLeaveRequests", "confirmCancelDescription"])}
      </Typography>

      <Box
        sx={{
          marginTop: "1.25rem"
        }}
      >
        <Button
          label={translateText([
            "myLeaveRequests",
            "confirmAndCancelRequestBtn"
          ])}
          endIcon={IconName.REQUEST_CANCEL_CROSS_ICON}
          buttonStyle={ButtonStyle.ERROR}
          onClick={handleCancelLeave}
        />
      </Box>
    </>
  );
};

export default EmployeeConfirmCancelLeavePopup;

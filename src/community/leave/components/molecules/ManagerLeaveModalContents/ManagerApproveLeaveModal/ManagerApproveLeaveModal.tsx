import { Box, Stack, Typography } from "@mui/material";
import { Dispatch, JSX, SetStateAction, useEffect } from "react";

import CheckIcon from "~community/common/assets/Icons/CheckIcon";
import CloseIcon from "~community/common/assets/Icons/CloseIcon";
import Button from "~community/common/components/atoms/Button/Button";
import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Avatar from "~community/common/components/molecules/Avatar/Avatar";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { useHandelLeaves } from "~community/leave/api/LeaveApi";
import { useLeaveStore } from "~community/leave/store/store";
import {
  LeaveExtraPopupTypes,
  LeaveStatusTypes
} from "~community/leave/types/LeaveRequestTypes";

import LeaveStatusPopupColumn from "../LeaveStatusPopupColumn/LeaveStatusPopupColumn";

interface Props {
  setPopupType: Dispatch<SetStateAction<string>>;
}

const ManagerApproveLeaveModal = ({ setPopupType }: Props): JSX.Element => {
  const leaveRequestData = useLeaveStore((state) => state.leaveRequestData);
  const { mutate, isSuccess, error: leaveError } = useHandelLeaves();
  const { setToastMessage } = useToast();

  const translateText = useTranslator(
    "leaveModule",
    "leaveRequests",
    "leaveManagerEmployee"
  );

  const handleApprove = (): void => {
    const requestData = {
      leaveRequestId: leaveRequestData?.leaveId as number,
      status: LeaveStatusTypes.APPROVED.toUpperCase(),
      reviewerComment: ""
    };
    mutate(requestData);
  };

  const handleDeclineModel = (): void => {
    setPopupType(LeaveExtraPopupTypes.DECLINE);
  };

  useEffect(() => {
    if (leaveError) {
      setToastMessage({
        open: true,
        toastType: "error",
        title: translateText(["approveLeaveFailTitle"]),
        description: translateText(["approveLeaveFailDesc"]),
        isIcon: true
      });
    } else if (isSuccess) {
      setToastMessage({
        open: true,
        toastType: "success",
        title: translateText(["approveLeaveSuccessTitle"]),
        description: translateText(["approveLeaveSuccessDesc"]),
        isIcon: true
      });
    }
  }, [leaveRequestData?.empName, leaveError, isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setPopupType(LeaveExtraPopupTypes.APPROVED_STATUS);
    }
  }, [leaveRequestData.leaveType, isSuccess, setPopupType]);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ marginBottom: "0.75rem" }}
        component="div"
        tabIndex={0}
        aria-label={`${leaveRequestData?.empName ?? ""} requested a ${
          leaveRequestData?.leaveType ?? ""
        } leave`}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            firstName={leaveRequestData?.empName ?? ""}
            lastName={leaveRequestData?.lastName ?? ""}
            src={leaveRequestData.avatarUrl ?? ""}
          />
          <Typography variant="body2" sx={{ fontSize: "1rem" }}>
            {translateText(["employeeName"], {
              employeeName: leaveRequestData?.empName
            }) ?? ""}
          </Typography>
        </Stack>
        <IconChip
          label={leaveRequestData?.leaveType ?? ""}
          isTruncated={false}
          icon={leaveRequestData?.leaveEmoji ?? ""}
          chipStyles={{ backgroundColor: "grey.100", py: "0.75rem" }}
        />
      </Stack>

      <Box
        sx={{
          maxHeight: "50vh",
          overflow: "auto"
        }}
      >
        <Box sx={{ pt: "0.75rem", pb: "1rem" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pb: "1rem" }}
            component="div"
            tabIndex={0}
            aria-label={`Duration is ${leaveRequestData?.days ?? ""} leave on ${
              leaveRequestData?.dates ?? ""
            }`}
          >
            <Typography variant="body2" sx={{ fontSize: "1rem" }}>
              {translateText(["duration"])}:
            </Typography>
            <Stack direction="row" spacing={1}>
              <BasicChip
                label={leaveRequestData?.days ?? ""}
                chipStyles={{ backgroundColor: "grey.100", py: "0.75rem" }}
              />
              <BasicChip
                label={leaveRequestData?.dates ?? ""}
                chipStyles={{ backgroundColor: "grey.100", py: "0.75rem" }}
              />
            </Stack>
          </Stack>
          <LeaveStatusPopupColumn
            label={translateText(["reason"])}
            text={
              translateText(["reasonData"], {
                reason: leaveRequestData?.reason
              }) ?? ""
            }
            isDisabled={true}
          />
        </Box>
      </Box>

      <Stack spacing={2} sx={{ mt: "1rem" }}>
        <Button
          label={translateText(["approveLeave"])}
          endIcon={<CheckIcon />}
          onClick={handleApprove}
          ariaLabel={translateText(["approveAreaLabel"])}
        />
        <Button
          buttonStyle={ButtonStyle.ERROR}
          label={translateText(["declineLeave"])}
          endIcon={<CloseIcon />}
          onClick={handleDeclineModel}
          ariaLabel={translateText(["cancelAreaLabel"])}
        />
      </Stack>
    </Box>
  );
};

export default ManagerApproveLeaveModal;

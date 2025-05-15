import { Box } from "@mui/material";
import { JSX } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import StatusPopupRow from "~community/leave/components/molecules/StatusPopupRow/StatusPopupRow";
import { useLeaveStore } from "~community/leave/store/store";
import {
  getStartEndDate,
  handleDurationDay,
  handleLeaveStatus,
  leaveStatusIconSelector
} from "~community/leave/utils/leaveRequest/LeaveRequestUtils";

import AttachmentRow from "../../AttachmentRow/AttachmentRow";

interface Props {
  handleRequestStatusPopup: () => void;
}

const EmployeeCancelLeaveStatusPopup = ({
  handleRequestStatusPopup
}: Props): JSX.Element => {
  const employeeLeaveRequestData = useLeaveStore(
    (state) => state.employeeLeaveRequestData
  );
  const translateText = useTranslator("leaveModule", "myRequests");

  return (
    <Box
      sx={{
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem"
      }}
    >
      <StatusPopupRow
        label={translateText(["myLeaveRequests", "type"])}
        iconName={employeeLeaveRequestData?.leaveType.name}
        icon={employeeLeaveRequestData?.leaveType.emojiCode}
      />
      <StatusPopupRow
        label={translateText(["myLeaveRequests", "status"])}
        iconName={handleLeaveStatus(employeeLeaveRequestData.status)}
        icon={leaveStatusIconSelector(employeeLeaveRequestData.status)}
      />
      <StatusPopupRow
        label={translateText(["myLeaveRequests", "duration"])}
        durationByDays={handleDurationDay(
          employeeLeaveRequestData.durationDays,
          employeeLeaveRequestData.leaveState,
          translateText
        )}
        durationDate={getStartEndDate(
          employeeLeaveRequestData.startDate,
          employeeLeaveRequestData.endDate
        )}
      />
      <StatusPopupRow
        label={translateText(["myLeaveRequests", "recipient"])}
        isRecipient={true}
        reviewer={employeeLeaveRequestData?.reviewer ?? undefined}
      />
      <AttachmentRow attachments={employeeLeaveRequestData?.attachments} />
      <Button
        label={translateText(["myLeaveRequests", "proceedToHome"])}
        endIcon={IconName.RIGHT_ARROW_ICON}
        buttonStyle={ButtonStyle.PRIMARY}
        onClick={() => handleRequestStatusPopup()}
      />
    </Box>
  );
};

export default EmployeeCancelLeaveStatusPopup;

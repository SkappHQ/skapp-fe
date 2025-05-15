import { Stack } from "@mui/material";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import LeaveAllocation from "~community/leave/components/molecules/LeaveAllocation/LeaveAllocation";
import { MyRequestModalEnums } from "~community/leave/enums/MyRequestEnums";
import { useLeaveStore } from "~community/leave/store/store";

const LeaveTypeSelectionModal = () => {
  const translateText = useTranslator(
    "leaveModule",
    "myRequests",
    "leaveTypeSelectionModal"
  );

  const { setMyLeaveRequestModalType } = useLeaveStore();

  return (
    <Stack sx={{ gap: "1rem" }}>
      <LeaveAllocation />
      <Button
        buttonStyle={ButtonStyle.TERTIARY}
        label={translateText(["cancelBtn"])}
        endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
        onClick={() => setMyLeaveRequestModalType(MyRequestModalEnums.NONE)}
      />
    </Stack>
  );
};

export default LeaveTypeSelectionModal;

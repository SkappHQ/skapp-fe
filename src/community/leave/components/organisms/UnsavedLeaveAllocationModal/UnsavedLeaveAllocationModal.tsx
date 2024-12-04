import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useLeaveStore } from "~community/leave/store/store";
import {
  CustomLeaveAllocationModalTypes,
  CustomLeaveAllocationType
} from "~community/leave/types/CustomLeaveAllocationTypes";

interface Props {
  setTempLeaveAllocationDetails: Dispatch<
    SetStateAction<CustomLeaveAllocationType | undefined>
  >;
  onResume: () => void;
}

const UnsavedLeaveAllocationModal = ({
  setTempLeaveAllocationDetails,
  onResume
}: Props) => {
  const translateText = useTranslator("leaveModule", "customLeave");
  const { setCustomLeaveAllocationModalType, setIsLeaveAllocationModalOpen } =
    useLeaveStore((state) => state);

  return (
    <Box>
      <Typography sx={{ mt: "1rem" }}>
        {translateText(["unsavedChangesAddModalDes"])}
      </Typography>
      <Box>
        <Button
          label={translateText(["resumeTask"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.PRIMARY}
          onClick={onResume}
        />
        <Button
          label={translateText(["leaveAnyway"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.ERROR}
          onClick={() => {
            setTempLeaveAllocationDetails(undefined);
            setIsLeaveAllocationModalOpen(false);
            setCustomLeaveAllocationModalType(
              CustomLeaveAllocationModalTypes.NONE
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default UnsavedLeaveAllocationModal;

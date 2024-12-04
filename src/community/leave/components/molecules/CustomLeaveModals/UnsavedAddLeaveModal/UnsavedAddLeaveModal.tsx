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
  setTempLeaveDetails: Dispatch<
    SetStateAction<CustomLeaveAllocationType | undefined>
  >;
}

const UnsavedAddLeaveModal = ({ setTempLeaveDetails }: Props) => {
  const translateText = useTranslator("leaveModule", "leaveConfiguration");
  const { setCustomLeaveAllocationModalType, setIsLeaveAllocationModalOpen } =
    useLeaveStore((state) => state);

  return (
    <Box>
      <Typography sx={{ mt: "1rem" }}>
        {translateText(["unsavedChangesAddLeaveModalDes"])}
      </Typography>
      <Box>
        <Button
          label={translateText(["resumeTask"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.PRIMARY}
          onClick={() => {
            setCustomLeaveAllocationModalType(
              CustomLeaveAllocationModalTypes.ADD_LEAVE_ALLOCATION
            );
          }}
        />
        <Button
          label={translateText(["leaveAnyway"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.ERROR}
          onClick={() => {
            setTempLeaveDetails(undefined);
            setIsLeaveAllocationModalOpen(false);
          }}
        />
      </Box>
    </Box>
  );
};

export default UnsavedAddLeaveModal;

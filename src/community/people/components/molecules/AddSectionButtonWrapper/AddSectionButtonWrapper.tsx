import { Stack } from "@mui/material";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import useStepper from "~community/people/hooks/useStepper";

interface Props {
  isSaveDisabled: boolean;
}

const AddSectionButtonWrapper = ({ isSaveDisabled }: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  const { handleNext, handleBack } = useStepper();

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      spacing={2}
      sx={{ padding: "1rem 0" }}
    >
      <Button
        label={"Back"}
        buttonStyle={ButtonStyle.TERTIARY}
        startIcon={IconName.LEFT_ARROW_ICON}
        isFullWidth={false}
        onClick={handleBack}
      />
      <Button
        label={"Next"}
        buttonStyle={ButtonStyle.PRIMARY}
        endIcon={IconName.RIGHT_ARROW_ICON}
        isFullWidth={false}
        onClick={handleNext}
        disabled={isSaveDisabled}
      />
      <Button
        label={"Save Details"}
        buttonStyle={ButtonStyle.PRIMARY}
        endIcon={IconName.SAVE_ICON}
        isFullWidth={false}
        onClick={() => {}}
        disabled={isSaveDisabled}
      />
    </Stack>
  );
};

export default AddSectionButtonWrapper;

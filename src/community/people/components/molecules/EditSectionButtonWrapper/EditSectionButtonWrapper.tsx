import { Stack } from "@mui/material";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import { usePeopleStore } from "~community/people/store/store";

interface Props {
  onCancelClick: () => void;
  onSaveClick: () => void;
}

const EditSectionButtonWrapper = ({ onCancelClick, onSaveClick }: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  const { hasChanged } = useFormChangeDetector();

  const { profilePic } = usePeopleStore((state) => state);

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      spacing={2}
      sx={{ padding: "1rem 0" }}
    >
      <Button
        label={translateText(["cancel"])}
        buttonStyle={ButtonStyle.TERTIARY}
        endIcon={IconName.CLOSE_ICON}
        isFullWidth={false}
        onClick={onCancelClick}
        disabled={!hasChanged}
      />
      <Button
        label={translateText(["saveDetails"])}
        buttonStyle={ButtonStyle.PRIMARY}
        endIcon={IconName.RIGHT_ARROW_ICON}
        isFullWidth={false}
        onClick={onSaveClick}
        disabled={!hasChanged && profilePic === null}
      />
    </Stack>
  );
};

export default EditSectionButtonWrapper;

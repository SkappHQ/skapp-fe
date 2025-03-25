import { Stack } from "@mui/material";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useAddEmployee } from "~community/people/api/PeopleApi";
import useStepper from "~community/people/hooks/useStepper";
import { usePeopleStore } from "~community/people/store/store";

interface Props {
  isSaveDisabled?: boolean;
  onNextClick?: () => void;
  setIsSuccess?: (value: boolean) => void;
}

const AddSectionButtonWrapper = ({
  isSaveDisabled = false,
  onNextClick,
  setIsSuccess
}: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  const { handleNext, handleBack, activeStep } = useStepper();

  const { mutate } = useAddEmployee();

  const { employee } = usePeopleStore((state) => state);

  const handleSave = () => {
    if (employee) {
      mutate(employee, {
        onSuccess: () => {
          alert("Employee added successfully");
          setIsSuccess && setIsSuccess(true);
        }
      });
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      spacing={2}
      sx={{ padding: "1rem 0" }}
    >
      {activeStep > 0 && (
        <Button
          label={"Back"}
          buttonStyle={ButtonStyle.TERTIARY}
          startIcon={IconName.LEFT_ARROW_ICON}
          isFullWidth={false}
          onClick={handleBack}
        />
      )}

      {activeStep === 4 ? (
        <Button
          label={"Save Details"}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.SAVE_ICON}
          isFullWidth={false}
          onClick={handleSave}
          disabled={isSaveDisabled}
        />
      ) : (
        <Button
          label={"Next"}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.RIGHT_ARROW_ICON}
          isFullWidth={false}
          onClick={() => {
            handleNext();
            if (onNextClick) {
              onNextClick();
            }
          }}
          disabled={isSaveDisabled}
        />
      )}
    </Stack>
  );
};

export default AddSectionButtonWrapper;

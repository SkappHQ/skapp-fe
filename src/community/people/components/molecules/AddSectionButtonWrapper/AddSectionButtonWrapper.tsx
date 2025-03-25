import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";

import Button from "~community/common/components/atoms/Button/Button";
import ROUTES from "~community/common/constants/routes";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
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

  const { handleBack, activeStep } = useStepper();

  const { setToastMessage } = useToast();

  const router = useRouter();

  const onSuccess = () => {
    setToastMessage({
      open: true,
      toastType: ToastType.SUCCESS,
      title: translateText(["employeeAddSuccessToastTitle"]),
      description: translateText(["employeeAddSuccessToastDescription"])
    });
    setIsSuccess && setIsSuccess(true);
    // router.push(ROUTES.PEOPLE.DIRECTORY);
  };

  const onError = () => {
    setToastMessage({
      open: true,
      toastType: ToastType.ERROR,
      title: translateText(["employeeAddErrorToastTitle"]),
      description: translateText(["employeeAddErrorToastDescription"])
    });
  };

  const { mutate } = useAddEmployee(onSuccess, onError);

  const { employee } = usePeopleStore((state) => state);

  const handleSave = () => {
    if (employee) {
      mutate(employee);
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
          label={translateText(["back"])}
          buttonStyle={ButtonStyle.TERTIARY}
          startIcon={IconName.LEFT_ARROW_ICON}
          isFullWidth={false}
          onClick={handleBack}
        />
      )}

      {activeStep === 4 ? (
        <Button
          label={translateText(["saveDetails"])}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.SAVE_ICON}
          isFullWidth={false}
          onClick={handleSave}
          disabled={isSaveDisabled}
        />
      ) : (
        <Button
          label={translateText(["next"])}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.RIGHT_ARROW_ICON}
          isFullWidth={false}
          onClick={() => {
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

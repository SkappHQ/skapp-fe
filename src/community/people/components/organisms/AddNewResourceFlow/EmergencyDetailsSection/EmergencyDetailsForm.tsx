import { Stack } from "@mui/system";
import {
  Dispatch,
  JSX,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { emergencyDetailsSectionTestId } from "~community/common/constants/testIds";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { usePeopleStore } from "~community/people/store/store";
import { EditAllInformationFormStatus } from "~community/people/types/EditEmployeeInfoTypes";

import PrimaryDetailsSection from "./PrimaryDetailsSection";
import SecondaryDetailsSection from "./SecondaryDetailsSection";

interface Props {
  onNext: () => void;
  onBack: () => void;
  isUpdate?: boolean;
  isSubmitDisabled?: boolean;
  isLoading?: boolean;
  updateEmployeeStatus?: EditAllInformationFormStatus;
  setUpdateEmployeeStatus?: Dispatch<
    SetStateAction<EditAllInformationFormStatus>
  >;
  isSuperAdminEditFlow?: boolean;
  isInputsDisabled?: boolean;
}

const EmergencyDetailsForm = ({
  onNext,
  onBack,
  isUpdate,
  isSubmitDisabled = false,
  isLoading = false,
  updateEmployeeStatus,
  setUpdateEmployeeStatus,
  isSuperAdminEditFlow = false,
  isInputsDisabled = false
}: Props): JSX.Element => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );
  const { employeeDataChanges } = usePeopleStore((state) => state);
  const [initialResetFlag, setInitialResetFlag] = useState(false);

  const primaryDetailsRef = useRef<{
    validateForm: () => Promise<Record<string, string>>;
    submitForm: () => Promise<void>;
    resetForm: () => void;
  }>();

  const secondaryDetailsRef = useRef<{
    validateForm: () => Promise<Record<string, string>>;
    submitForm: () => Promise<void>;
    resetForm: () => void;
  }>();

  const handleNext = async () => {
    const primaryFormErrors = await primaryDetailsRef?.current?.validateForm();
    const secondaryFormErrors =
      await secondaryDetailsRef?.current?.validateForm();

    setTimeout(async () => {
      const primaryFormIsValid =
        primaryFormErrors && Object.keys(primaryFormErrors).length === 0;
      const secondaryFormIsValid =
        secondaryFormErrors && Object.keys(secondaryFormErrors).length === 0;

      if (primaryFormIsValid && secondaryFormIsValid) {
        await primaryDetailsRef?.current?.submitForm();
        await secondaryDetailsRef?.current?.submitForm();
        setUpdateEmployeeStatus?.(EditAllInformationFormStatus.VALIDATED);
        onNext();
      } else {
        setUpdateEmployeeStatus?.(EditAllInformationFormStatus.VALIDATE_ERROR);
      }
    }, 0);
  };

  useEffect(() => {
    const resetForms = () => {
      primaryDetailsRef?.current?.resetForm();
      secondaryDetailsRef?.current?.resetForm();
    };

    if (employeeDataChanges > 0) {
      resetForms();
    }
    if (employeeDataChanges === 0 && isSuperAdminEditFlow) {
      setInitialResetFlag(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeDataChanges]);

  useEffect(() => {
    if (updateEmployeeStatus === EditAllInformationFormStatus.TRIGGERED) {
      void handleNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateEmployeeStatus]);

  useEffect(() => {
    const validateInitialForms = async () => {
      await Promise.all([
        primaryDetailsRef?.current?.validateForm(),
        secondaryDetailsRef?.current?.validateForm()
      ]);
    };
    if (isSuperAdminEditFlow && initialResetFlag) {
      void validateInitialForms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialResetFlag]);

  return (
    <>
      <PrimaryDetailsSection
        ref={primaryDetailsRef as any}
        isInputsDisabled={isInputsDisabled}
      />
      <SecondaryDetailsSection
        ref={secondaryDetailsRef as any}
        isInputsDisabled={isInputsDisabled}
      />
      {!isInputsDisabled && (
        <Stack
          direction="row"
          justifyContent="flex-start"
          spacing={2}
          sx={{ padding: "1rem 0" }}
        >
          <Button
            label={
              isUpdate ? translateText(["cancel"]) : translateText(["back"])
            }
            buttonStyle={ButtonStyle.TERTIARY}
            startIcon={isUpdate ? <></> : IconName.LEFT_ARROW_ICON}
            endIcon={isUpdate ? IconName.CLOSE_ICON : <></>}
            isFullWidth={false}
            onClick={onBack}
            disabled={isSubmitDisabled || isLoading || isInputsDisabled}
            data-testid={
              isUpdate
                ? emergencyDetailsSectionTestId.buttons.cancelBtn
                : emergencyDetailsSectionTestId.buttons.backBtn
            }
          />
          <Button
            label={
              isUpdate
                ? translateText(["saveDetails"])
                : translateText(["next"])
            }
            buttonStyle={ButtonStyle.PRIMARY}
            endIcon={isUpdate ? IconName.SAVE_ICON : IconName.RIGHT_ARROW_ICON}
            isFullWidth={false}
            onClick={handleNext}
            disabled={isSubmitDisabled || isLoading || isInputsDisabled}
            isLoading={isLoading}
            data-testid={
              isUpdate
                ? emergencyDetailsSectionTestId.buttons.saveDetailsBtn
                : emergencyDetailsSectionTestId.buttons.nextBtn
            }
          />
        </Stack>
      )}
    </>
  );
};

export default EmergencyDetailsForm;

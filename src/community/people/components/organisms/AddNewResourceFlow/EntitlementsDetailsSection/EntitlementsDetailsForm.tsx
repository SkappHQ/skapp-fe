import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { JSX, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import PeopleLayout from "~community/common/components/templates/PeopleLayout/PeopleLayout";
import { entitlementsDetailsFormTestId } from "~community/common/constants/testIds";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { leaveBulkUploadResponse } from "~community/leave/types/LeaveTypes";
import { useAddUserBulkEntitlementsWithoutCSV } from "~community/people/api/PeopleApi";
import { usePeopleStore } from "~community/people/store/store";
import { handleAddNewResourceSuccess } from "~community/people/utils/directoryUtils/addNewResourceFlowUtils/addNewResourceUtils";
import {
  handleBulkUploadResponse,
  handleSaveEntitlements
} from "~community/people/utils/directoryUtils/addNewResourceFlowUtils/entitlementDetailsFormUtils";

import EntitlementsDetailsSection from "./EntitlementsDetailsSection";
import styles from "./styles";

interface Props {
  onNext: () => void;
  onSave: () => void;
  onBack: () => void;
  isLoading: boolean;
  isSuccess: boolean;
}

const EntitlementsDetailsForm = ({
  onNext,
  onSave,
  onBack,
  isLoading,
  isSuccess
}: Props): JSX.Element => {
  const classes = styles();

  const router = useRouter();

  const { setToastMessage } = useToast();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  const {
    employeeGeneralDetails,
    employeeEmploymentDetails,
    employeeEntitlementsDetails,
    resetEmployeeData
  } = usePeopleStore((state) => ({
    employeeGeneralDetails: state.employeeGeneralDetails,
    employeeEmploymentDetails: state.employeeEmploymentDetails,
    employeeEntitlementsDetails: state.employeeEntitlementsDetails,
    resetEmployeeData: state.resetEmployeeData
  }));

  const [currentYearSuccessFlag, setCurrentYearSuccessFlag] =
    useState<boolean>(false);
  const [nextYearSuccessFlag, setNextYearSuccessFlag] =
    useState<boolean>(false);

  const onCurrentYearSuccess = (responseData: leaveBulkUploadResponse) =>
    handleBulkUploadResponse({
      responseData,
      setSuccessFlag: setCurrentYearSuccessFlag,
      translateText,
      setToastMessage
    });

  const onNextYearSuccess = (responseData: leaveBulkUploadResponse) =>
    handleBulkUploadResponse({
      responseData,
      setSuccessFlag: setNextYearSuccessFlag,
      translateText,
      setToastMessage
    });

  const onError = () =>
    setToastMessage({
      toastType: ToastType.ERROR,
      title: translateText(["entitlementErrorMessage"]),
      open: true
    });

  const {
    mutate: currentYearMutation,
    isPending: currentYearEntitlementsLoading
  } = useAddUserBulkEntitlementsWithoutCSV(onCurrentYearSuccess, onError);

  const { mutate: nextYearMutation, isPending: nextYearEntitlementsLoading } =
    useAddUserBulkEntitlementsWithoutCSV(onNextYearSuccess, onError);

  useEffect(() => {
    if (isSuccess) {
      handleSaveEntitlements({
        isSuccess,
        employeeGeneralDetails,
        employeeEmploymentDetails,
        employeeEntitlementsDetails,
        currentYearMutation,
        currentYearSuccessFlag,
        setCurrentYearSuccessFlag,
        nextYearMutation,
        nextYearSuccessFlag,
        setNextYearSuccessFlag
      });
    }

    // NOTE: Adding Missing Dependencies will cause a rerendering issue.
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess && currentYearSuccessFlag && nextYearSuccessFlag) {
      handleAddNewResourceSuccess({
        setToastMessage,
        resetEmployeeData,
        router,
        translateText
      });
    }

    // NOTE: Adding Missing Dependencies will cause a rerendering issue.
  }, [isSuccess, currentYearSuccessFlag, nextYearSuccessFlag]);

  const handleNext = () => {
    onNext();
    !isSuccess && onSave();
  };

  return (
    <PeopleLayout
      title={translateText(["entitlements"])}
      pageHead={translateText(["head"])}
      containerStyles={classes.layoutContainerStyles}
      dividerStyles={classes.layoutDividerStyles}
    >
      <>
        <EntitlementsDetailsSection />
        <Stack sx={classes.buttonWrapper}>
          <Button
            dataTestId={entitlementsDetailsFormTestId.buttons.backBtn}
            isFullWidth={false}
            label={translateText(["back"])}
            onClick={onBack}
            endIcon={IconName.LEFT_ARROW_ICON}
            buttonStyle={ButtonStyle.TERTIARY}
          />
          <Button
            dataTestId={entitlementsDetailsFormTestId.buttons.saveDetailsBtn}
            isFullWidth={false}
            isLoading={
              isLoading ||
              currentYearEntitlementsLoading ||
              nextYearEntitlementsLoading
            }
            label={translateText(["saveDetails"])}
            onClick={handleNext}
            endIcon={IconName.SAVE_ICON}
            buttonStyle={ButtonStyle.PRIMARY}
          />
        </Stack>
      </>
    </PeopleLayout>
  );
};

export default EntitlementsDetailsForm;

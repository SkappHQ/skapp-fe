import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { JSX, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import PeopleLayout from "~community/common/components/templates/PeopleLayout/PeopleLayout";
import ROUTES from "~community/common/constants/routes";
import { entitlementsDetailsFormTestId } from "~community/common/constants/testIds";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { processEnitlementPayload } from "~community/common/utils/leaveUtils";
import {
  EntitlementYears,
  leaveBulkUploadResponse
} from "~community/leave/types/LeaveTypes";
import { useAddUserBulkEntitlementsWithoutCSV } from "~community/people/api/PeopleApi";
import { usePeopleStore } from "~community/people/store/store";

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
  const router = useRouter();
  const classes = styles();
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
  } = usePeopleStore((state) => state);

  const [employeeSaveSuccessFlag, setEmployeeSaveSuccessFlag] = useState(false);
  const [currentYearSuccessFlag, setCurrentYearSuccessFlag] = useState(false);
  const [nextYearSuccessFlag, setNextYearSuccessFlag] = useState(false);

  const onCurrentYearSuccess = (responseData: leaveBulkUploadResponse) => {
    responseData?.bulkStatusSummary?.failedCount === 0
      ? setCurrentYearSuccessFlag(true)
      : setToastMessage({
          toastType: ToastType.SUCCESS,
          title: translateText(["entitlementErrorMessage"]),
          description: responseData?.bulkRecordErrorLogs[0]?.message,
          open: true
        });
  };

  const onNextYearSuccess = (responseData: leaveBulkUploadResponse) => {
    responseData?.bulkStatusSummary?.failedCount === 0
      ? setNextYearSuccessFlag(true)
      : setToastMessage({
          toastType: ToastType.ERROR,
          title: translateText(["entitlementErrorMessage"]),
          description: responseData?.bulkRecordErrorLogs[0]?.message,
          open: true
        });
  };

  const onError = () => {
    setToastMessage({
      toastType: ToastType.ERROR,
      title: translateText(["entitlementErrorMessage"]),
      open: true
    });
  };

  const {
    mutate: currentYearMutation,
    isPending: currentYearEntitlementsLoading
  } = useAddUserBulkEntitlementsWithoutCSV(onCurrentYearSuccess, onError);
  const { mutate: nextYearMutation, isPending: nextYearEntitlementsLoading } =
    useAddUserBulkEntitlementsWithoutCSV(onNextYearSuccess, onError);

  const handleSaveResource = () => {
    !employeeSaveSuccessFlag && onSave();
  };

  const handleNext = () => {
    onNext();
    handleSaveResource();
  };

  useEffect(() => {
    if (isSuccess) {
      setEmployeeSaveSuccessFlag(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    const handleSaveEntitlements = () => {
      if (!employeeSaveSuccessFlag) {
        return;
      }

      const currentYearPayload = processEnitlementPayload(
        EntitlementYears.CURRENT,
        employeeEmploymentDetails?.employeeNumber,
        employeeGeneralDetails?.firstName,
        employeeEmploymentDetails?.workEmail,
        employeeEntitlementsDetails
      );
      const nextYearPayload = processEnitlementPayload(
        EntitlementYears.NEXT,
        employeeEmploymentDetails?.employeeNumber,
        employeeGeneralDetails?.firstName,
        employeeEmploymentDetails?.workEmail,
        employeeEntitlementsDetails
      );

      !currentYearPayload?.entitlementDetailsList?.[0]?.entitlements?.length &&
        setCurrentYearSuccessFlag(true);

      !currentYearSuccessFlag &&
        currentYearPayload?.entitlementDetailsList?.[0]?.entitlements?.length &&
        currentYearMutation(currentYearPayload);

      !nextYearPayload?.entitlementDetailsList?.[0]?.entitlements?.length &&
        setNextYearSuccessFlag(true);

      !nextYearSuccessFlag &&
        nextYearPayload?.entitlementDetailsList?.[0]?.entitlements?.length &&
        nextYearMutation(nextYearPayload);
    };

    // Note: Adding Missing Dependencies will cause a rerendering issue.
    handleSaveEntitlements();
  }, [employeeSaveSuccessFlag]);

  useEffect(() => {
    if (
      employeeSaveSuccessFlag &&
      currentYearSuccessFlag &&
      nextYearSuccessFlag
    ) {
      setToastMessage({
        toastType: ToastType.SUCCESS,
        title: translateText(["resourceSuccessMessage"]),
        open: true
      });

      resetEmployeeData();
      void router.push(ROUTES.PEOPLE.DIRECTORY);
    }
    // Note: Adding Missing Dependencies will cause a rerendering issue.
  }, [employeeSaveSuccessFlag, currentYearSuccessFlag, nextYearSuccessFlag]);

  return (
    <PeopleLayout
      title={translateText(["entitlements"])}
      containerStyles={classes.layoutContainerStyles}
      dividerStyles={classes.layoutDividerStyles}
      pageHead={translateText(["head"])}
    >
      <>
        <EntitlementsDetailsSection />
        <Stack
          direction="row"
          justifyContent="flex-start"
          spacing={2}
          sx={{ padding: "1rem 0" }}
        >
          <Button
            label="Back"
            buttonStyle={ButtonStyle.TERTIARY}
            endIcon={IconName.LEFT_ARROW_ICON}
            isFullWidth={false}
            onClick={onBack}
            dataTestId={entitlementsDetailsFormTestId.buttons.backBtn}
          />
          <Button
            label={translateText(["saveDetails"])}
            buttonStyle={ButtonStyle.PRIMARY}
            endIcon={IconName.SAVE_ICON}
            isFullWidth={false}
            onClick={handleNext}
            isLoading={
              isLoading ||
              currentYearEntitlementsLoading ||
              nextYearEntitlementsLoading
            }
            dataTestId={entitlementsDetailsFormTestId.buttons.saveDetailsBtn}
          />
        </Stack>
      </>
    </PeopleLayout>
  );
};

export default EntitlementsDetailsForm;

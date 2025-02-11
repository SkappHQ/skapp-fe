import { Box, Modal } from "@mui/material";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useUploadImages } from "~community/common/api/FileHandleApi";
import StepperComponent from "~community/common/components/molecules/Stepper/Stepper";
import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import {
  MediaQueries,
  useMediaQuery
} from "~community/common/hooks/useMediaQuery";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { EmployeeTypes } from "~community/common/types/AuthTypes";
import { useHandleAddNewResource } from "~community/people/api/PeopleApi";
import DiscardChangeApprovalModal from "~community/people/components/molecules/DiscardChangeApprovalModal/DiscardChangeApprovalModal";
import useCreateEmployeeObject from "~community/people/hooks/useCreateEmployeeObject";
import useStepper from "~community/people/hooks/useStepper";
import { usePeopleStore } from "~community/people/store/store";
import { EmployeeType } from "~community/people/types/AddNewResourceTypes";
import { DiscardChangeModalType } from "~community/people/types/EditEmployeeInfoTypes";
import {
  handleError,
  handleGoBack
} from "~community/people/utils/directoryUtils/addNewResourceFlowUtils/addNewResourceUtils";
import uploadImage from "~community/people/utils/image/uploadImage";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";

import EmergencyDetailsForm from "./EmergencyDetailsSection/EmergencyDetailsForm";
import EmploymentDetailsForm from "./EmploymentDetailsSection/EmploymentDetailsForm";
import EntitlementsDetailsForm from "./EntitlementsDetailsSection/EntitlementsDetailsForm";
import PersonalDetailsForm from "./PersonalDetailsSection/PersonalDetailsForm";
import SystemPermissionForm from "./SystemPermissionSection/SystemPermissionForm";
import styles from "./styles";

const AddNewResourceFlow = () => {
  const classes = styles();

  const queryMatches = useMediaQuery();
  const isBelow1024 = queryMatches(MediaQueries.BELOW_1024);

  const router = useRouter();

  const environment = useGetEnvironment();

  const { data: sessionData } = useSession();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );
  const translateError = useTranslator("peopleModule", "addResource");

  const { setToastMessage, toastMessage } = useToast();

  const steps = useMemo(() => {
    let steps = [
      translateText(["personal"]),
      translateText(["emergency"]),
      translateText(["employment"]),
      translateText(["systemPermissions"]),
      translateText(["entitlements"])
    ];

    if (!sessionData?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE)) {
      steps = steps.filter((step) => step !== translateText(["entitlements"]));
    }

    return steps;
  }, [sessionData?.user?.roles, translateText]);

  const { activeStep, handleNext, handleBack } = useStepper(steps);

  const { getEmployeeObject } = useCreateEmployeeObject({
    replaceDefaultValuesWithEmptyStrings: true
  });

  const {
    mutate: handleAddNewResource,
    isPending,
    isSuccess,
    isError,
    error
  } = useHandleAddNewResource();

  const { mutateAsync: handleUploadImagesAsync } = useUploadImages();

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const errorMessage =
        error?.response?.data?.results[0]?.message ?? "Something went wrong";

      handleError({
        message: errorMessage,
        setToastMessage,
        translateError
      });
    }
  }, [error, isError]);

  useEffect(() => {
    return () => {
      resetEmployeeData();
    };
  }, []);

  const {
    employeeGeneralDetails,
    employeeContactDetails,
    employeeFamilyDetails,
    employeeEducationalDetails,
    employeeSocialMediaDetails,
    employeeHealthAndOtherDetails,
    employeeEmergencyContactDetails,
    employeeEmploymentDetails,
    employeeCareerDetails,
    employeeIdentificationAndDiversityDetails,
    employeePreviousEmploymentDetails,
    employeeVisaDetails,
    userRoles,
    resetEmployeeData
  } = usePeopleStore((state) => ({
    employeeGeneralDetails: state.employeeGeneralDetails,
    employeeContactDetails: state.employeeContactDetails,
    employeeFamilyDetails: state.employeeFamilyDetails,
    employeeEducationalDetails: state.employeeEducationalDetails,
    employeeSocialMediaDetails: state.employeeSocialMediaDetails,
    employeeHealthAndOtherDetails: state.employeeHealthAndOtherDetails,
    employeeEmergencyContactDetails: state.employeeEmergencyContactDetails,
    employeeEmploymentDetails: state.employeeEmploymentDetails,
    employeeCareerDetails: state.employeeCareerDetails,
    employeeIdentificationAndDiversityDetails:
      state.employeeIdentificationAndDiversityDetails,
    employeePreviousEmploymentDetails: state.employeePreviousEmploymentDetails,
    employeeVisaDetails: state.employeeVisaDetails,
    userRoles: state.userRoles,
    resetEmployeeData: state.resetEmployeeData
  }));

  const initialDiscardChangeModalState = {
    isModalOpen: false,
    modalType: "",
    modalOpenedFrom: ""
  };

  const [isDiscardChangesModal, setIsDiscardChangesModal] =
    useState<DiscardChangeModalType>(initialDiscardChangeModalState);

  const handleSave = async () => {
    const newAuthPicURL = await uploadImage({
      environment,
      authPic: employeeGeneralDetails?.authPic,
      thumbnail: employeeGeneralDetails?.thumbnail,
      imageUploadMutate: handleUploadImagesAsync,
      onError: () =>
        handleError({
          message: translateError(["uploadError"]),
          setToastMessage,
          translateError
        })
    });

    const data: EmployeeType = {
      generalDetails: {
        ...employeeGeneralDetails,
        authPic: newAuthPicURL
      },
      contactDetails: employeeContactDetails,
      familyDetails: employeeFamilyDetails,
      educationalDetails: employeeEducationalDetails,
      socialMediaDetails: employeeSocialMediaDetails,
      healthAndOtherDetails: employeeHealthAndOtherDetails,
      emergencyDetails: employeeEmergencyContactDetails,
      employmentDetails: employeeEmploymentDetails,
      careerDetails: employeeCareerDetails,
      identificationAndDiversityDetails:
        employeeIdentificationAndDiversityDetails,
      previousEmploymentDetails: employeePreviousEmploymentDetails,
      visaDetails: employeeVisaDetails,
      userRoles: userRoles
    };

    handleAddNewResource(data);
  };

  return (
    <>
      <ContentLayout
        isBackButtonVisible
        isDividerVisible={!isBelow1024}
        title={translateText(["title"])}
        pageHead={translateText(["head"])}
        subtitleNextToTitle={`${activeStep + 1} ${translateText(["of"])} ${steps.length}`}
        onBackClick={() =>
          handleGoBack({
            activeStep,
            isDiscardChangesModal,
            setIsDiscardChangesModal,
            router,
            getEmployeeObject
          })
        }
        containerStyles={{
          overflowY: activeStep === 1 ? "unset" : "auto"
        }}
      >
        <>
          <Box sx={classes.stepperWrapper}>
            {!isBelow1024 && (
              <StepperComponent
                activeStep={activeStep}
                steps={steps}
                stepperStyles={classes.stepper}
              />
            )}
          </Box>
          <>
            {activeStep === 0 && <PersonalDetailsForm onNext={handleNext} />}
            {activeStep === 1 && (
              <EmergencyDetailsForm onBack={handleBack} onNext={handleNext} />
            )}
            {activeStep === 2 && (
              <EmploymentDetailsForm
                onBack={handleBack}
                onNext={handleNext}
                onSave={handleSave}
                isLoading={isPending}
                isSuccess={isSuccess}
              />
            )}
            {activeStep === 3 && (
              <SystemPermissionForm
                onBack={handleBack}
                onNext={handleNext}
                onSave={handleSave}
                isLoading={isPending}
                isSuccess={isSuccess}
              />
            )}
            {sessionData?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE) &&
              activeStep === 4 && (
                <EntitlementsDetailsForm
                  onBack={handleBack}
                  onNext={handleNext}
                  onSave={handleSave}
                  isLoading={isPending}
                  isSuccess={isSuccess}
                />
              )}
          </>
        </>
      </ContentLayout>

      {isDiscardChangesModal.isModalOpen && (
        <Modal
          open={isDiscardChangesModal.isModalOpen}
          onClose={() =>
            setIsDiscardChangesModal(initialDiscardChangeModalState)
          }
          sx={classes.modal}
        >
          <DiscardChangeApprovalModal
            isDiscardChangesModal={isDiscardChangesModal}
            setIsDiscardChangesModal={setIsDiscardChangesModal}
            functionOnLeave={() =>
              handleGoBack({
                activeStep,
                isDiscardChangesModal,
                setIsDiscardChangesModal,
                router,
                getEmployeeObject
              })
            }
          />
        </Modal>
      )}

      <ToastMessage
        open={toastMessage.open}
        onClose={toastMessage.onClose}
        title={toastMessage.title}
        description={toastMessage.description}
        toastType={toastMessage.toastType}
        autoHideDuration={toastMessage.autoHideDuration}
      />
    </>
  );
};

export default AddNewResourceFlow;

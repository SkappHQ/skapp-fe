import { Box, Modal } from "@mui/material";
import { AxiosError } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useUploadImages } from "~community/common/api/FileHandleApi";
import StepperComponent from "~community/common/components/molecules/Stepper/Stepper";
import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { appModes } from "~community/common/constants/configs";
import ROUTES from "~community/common/constants/routes";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { isObjectEmpty } from "~community/common/utils/commonUtil";
import { useHandleAddNewResource } from "~community/people/api/PeopleApi";
import { DiscardTypeEnums } from "~community/people/enums/editResourceEnums";
import { usePeopleStore } from "~community/people/store/store";
import {
  EmployeeType,
  ModifiedFileType
} from "~community/people/types/AddNewResourceTypes";
import { DiscardChangeModalType } from "~community/people/types/EditEmployeeInfoTypes";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { FileCategories } from "~enterprise/common/types/s3Types";
import { uploadFileToS3ByUrl } from "~enterprise/common/utils/awsS3ServiceFunctions";

import useCreateEmployeeObject from "../../../hooks/useCreateEmployeeObject";
import DiscardChangeApprovalModal from "../../molecules/DiscardChangeApprovalModal/DiscardChangeApprovalModal";
import EmergencyDetailsForm from "./EmergencyDetailsSection/EmergencyDetailsForm";
import EmploymentDetailsForm from "./EmploymentDetailsSection/EmploymentDetailsForm";
import EntitlementsDetailsForm from "./EntitlementsDetailsSection/EntitlementsDetailsForm";
import PersonalDetailsForm from "./PersonalDetailsSection/PersonalDetailsForm";
import SystemPermissionForm from "./SystemPermissionSection/SystemPermissionForm";

const AddNewResourceFlow = () => {
  const router = useRouter();
  const { setToastMessage, toastMessage } = useToast();
  const translateError = useTranslator("peopleModule", "addResource");
  const { getEmployeeObject } = useCreateEmployeeObject({
    replaceDefaultValuesWithEmptyStrings: true
  });

  const environment = useGetEnvironment();

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
  } = usePeopleStore((state) => state);

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  const [isDiscardChangesModal, setIsDiscardChangesModal] =
    useState<DiscardChangeModalType>({
      isModalOpen: false,
      modalType: "",
      modalOpenedFrom: ""
    });

  const steps = [
    translateText(["personal"]),
    translateText(["emergency"]),
    translateText(["employment"]),
    translateText(["systemPermissions"]),
    translateText(["entitlements"])
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep < steps.length - 1 ? prevActiveStep + 1 : prevActiveStep
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep
    );
  };

  const handleGoBack = async () => {
    if (isDiscardChangesModal?.isModalOpen)
      await router.push(ROUTES.PEOPLE.DIRECTORY);
    if (activeStep > 0) {
      setIsDiscardChangesModal({
        isModalOpen: true,
        modalType: DiscardTypeEnums.DISCARD_FORM,
        modalOpenedFrom: ""
      });
      return;
    }
    if (activeStep === 0) {
      if (isObjectEmpty(getEmployeeObject())) {
        await router.push(ROUTES.PEOPLE.DIRECTORY);
        return;
      }
      setIsDiscardChangesModal({
        isModalOpen: true,
        modalType: DiscardTypeEnums.DISCARD_FORM,
        modalOpenedFrom: ""
      });
    }
  };

  const handleError = (message: string) => {
    setToastMessage({
      toastType: ToastType.ERROR,
      title: translateError(["addResourceError"]),
      open: true,
      description: message
    });
  };

  const { mutate, isPending, isSuccess, isError, error } =
    useHandleAddNewResource();

  const { mutateAsync: imageUploadMutate } = useUploadImages();

  const handleSave = async () => {
    let newAuthPicURL = "";
    if (
      employeeGeneralDetails?.authPic &&
      employeeGeneralDetails?.authPic?.length > 0
    ) {
      try {
        if (environment === appModes.COMMUNITY) {
          const formData = new FormData();
          formData.append(
            "file",
            employeeGeneralDetails?.authPic[0] as ModifiedFileType
          );
          formData.append("type", "USER_IMAGE");
          await imageUploadMutate(formData).then((response) => {
            const filePath = response.message?.split(
              "File uploaded successfully: "
            )[1];
            if (filePath) {
              const fileName = filePath.split("/").pop();
              if (fileName) {
                newAuthPicURL = fileName;
              }
            }
          });
        } else {
          newAuthPicURL = await uploadFileToS3ByUrl(
            employeeGeneralDetails?.authPic[0] as File,
            FileCategories.PROFILE_PICTURES
          );
        }
      } catch (error) {
        handleError(translateError(["uploadError"]));
      }
    }

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

    mutate(data);
  };

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const errorMessage =
        error?.response?.data?.results[0]?.message ?? "Something went wrong";
      handleError(errorMessage);
    }
  }, [error, isError]);

  useEffect(() => {
    return () => {
      resetEmployeeData();
    };
  }, []);

  return (
    <>
      <Head>
        <title>{translateText(["head"])}</title>
      </Head>
      <ContentLayout
        title={translateText(["title"])}
        subtitleNextToTitle={`${activeStep + 1} ${translateText(["of"])} ${
          steps.length
        }`}
        isBackButtonVisible
        onBackClick={handleGoBack}
        pageHead={translateText(["head"])}
        containerStyles={{
          overflowY: activeStep === 1 ? "unset" : "auto"
        }}
      >
        <>
          <Box sx={{ padding: "1.5rem 0", marginLeft: "-0.5rem" }}>
            <StepperComponent
              activeStep={activeStep}
              steps={steps}
              stepperStyles={{
                width: "70%"
              }}
            />
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
            {activeStep === 4 && (
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
            setIsDiscardChangesModal({
              isModalOpen: false,
              modalType: "",
              modalOpenedFrom: ""
            })
          }
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: ZIndexEnums.MODAL
          }}
        >
          <DiscardChangeApprovalModal
            isDiscardChangesModal={isDiscardChangesModal}
            setIsDiscardChangesModal={setIsDiscardChangesModal}
            functionOnLeave={handleGoBack}
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

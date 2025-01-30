import { Modal, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type NextPage } from "next/types";
import { useCallback, useEffect, useState } from "react";

import IndividualEmployeeTimeReportSection from "~community/attendance/components/molecules/IndividualEmployeeTimeReportBody/IndividualEmployeeTimeReportBody";
import { useUploadImages } from "~community/common/api/FileHandleApi";
import BoxStepper from "~community/common/components/molecules/BoxStepper/BoxStepper";
import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { appModes } from "~community/common/constants/configs";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import {
  AdminTypes,
  EmployeeTypes,
  ManagerTypes
} from "~community/common/types/AuthTypes";
import { EditAllInfoErrorTypes } from "~community/common/types/ErrorTypes";
import IndividualEmployeeLeaveReportSection from "~community/leave/components/molecules/IndividualEmployeeLeaveReportSection/IndividualEmployeeLeaveReportSection";
import {
  useGetSupervisedByMe,
  useGetUserPersonalDetails,
  useHandleEditNewResource,
  useUpdateLeaveManagerData
} from "~community/people/api/PeopleApi";
import DiscardChangeApprovalModal from "~community/people/components/molecules/DiscardChangeApprovalModal/DiscardChangeApprovalModal";
import EditAllInfoSkeleton from "~community/people/components/molecules/EditAllInfoSkeleton/EditAllInfoSkeleton";
import EditInfoCard from "~community/people/components/molecules/EditInfoCard/EditInfoCard";
import EditInfoCardSkeleton from "~community/people/components/molecules/EditInfoCard/EditInfoCardSkeleton";
import PeopleTimeline from "~community/people/components/molecules/PeopleTimeline/PeopleTimeline";
import ReinviteConfirmationModal from "~community/people/components/molecules/ReinviteConfirmationModal/ReinviteConfirmationModal";
import TerminationModalController from "~community/people/components/molecules/TerminationModalController/TerminationModalController";
import EmergencyDetailsForm from "~community/people/components/organisms/AddNewResourceFlow/EmergencyDetailsSection/EmergencyDetailsForm";
import EmploymentDetailsForm from "~community/people/components/organisms/AddNewResourceFlow/EmploymentDetailsSection/EmploymentDetailsForm";
import PersonalDetailsForm from "~community/people/components/organisms/AddNewResourceFlow/PersonalDetailsSection/PersonalDetailsForm";
import SystemPermissionForm from "~community/people/components/organisms/AddNewResourceFlow/SystemPermissionSection/SystemPermissionForm";
import {
  AccountStatusEnums,
  DiscardTypeEnums
} from "~community/people/enums/editResourceEnums";
import useDetectChange from "~community/people/hooks/useDetectChange";
import useGetEmployee from "~community/people/hooks/useGetEmployee";
import { usePeopleStore } from "~community/people/store/store";
import { EmployeeType } from "~community/people/types/AddNewResourceTypes";
import {
  DiscardChangeModalType,
  EditAllInformationFormStatus,
  EditAllInformationType
} from "~community/people/types/EditEmployeeInfoTypes";
import {
  EmployeeDetails,
  contractStates
} from "~community/people/types/EmployeeTypes";
import { superAdminRedirectSteps } from "~community/people/utils/addNewResourceFunctions";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { FileCategories } from "~enterprise/common/types/s3Types";
import {
  deleteFileFromS3,
  uploadFileToS3ByUrl
} from "~enterprise/common/utils/awsS3ServiceFunctions";

const EditAllInformation: NextPage = () => {
  const router = useRouter();
  const { setToastMessage, toastMessage } = useToast();
  const translateText = useTranslator("peopleModule");
  const { data } = useSession();

  const environment = useGetEnvironment();

  const { data: currentEmployeeDetails } = useGetUserPersonalDetails();

  const isPeopleAdmin = data?.user.roles?.includes(AdminTypes.PEOPLE_ADMIN);
  const isPeopleManager = data?.user.roles?.includes(
    ManagerTypes.PEOPLE_MANAGER
  );

  const translateToastText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );
  const translateErrors = useTranslator(
    "peopleModule",
    "editAllInfo.editAllInfoErrors"
  );

  const isAdmin = data?.user.roles?.includes(
    AdminTypes.SUPER_ADMIN ||
      AdminTypes.PEOPLE_ADMIN ||
      AdminTypes.LEAVE_ADMIN ||
      AdminTypes.ATTENDANCE_ADMIN
  );

  const isLeaveAdmin = data?.user.roles?.includes(AdminTypes.LEAVE_ADMIN);

  const isAttendanceAdmin = data?.user.roles?.includes(
    AdminTypes.ATTENDANCE_ADMIN
  );

  const isLeaveManager = data?.user.roles?.includes(
    ManagerTypes.LEAVE_MANAGER || AdminTypes.LEAVE_ADMIN
  );

  const isAttendanceManager = data?.user.roles?.includes(
    ManagerTypes.ATTENDANCE_MANAGER || AdminTypes.ATTENDANCE_ADMIN
  );

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
    employeeDataChanges,
    userRoles,
    setEmployeeGeneralDetails,
    resetEmployeeDataChanges,
    setIsReinviteConfirmationModalOpen,
    isReinviteConfirmationModalOpen
  } = usePeopleStore((state) => state);

  const { id, tab } = router.query;

  const {
    employee,
    isSuccess,
    setEmployeeData,
    refetchEmployeeData,
    discardEmployeeData,
    resetEmployeeData
  }: {
    employee: EmployeeDetails | undefined;
    isSuccess: boolean;
    setEmployeeData: () => void;
    refetchEmployeeData: () => Promise<void>;
    discardEmployeeData: () => void;
    resetEmployeeData: () => void;
  } = useGetEmployee({ id: Number(id) });

  const { isValuesChanged } = useDetectChange({ id: Number(id) });

  const [isLeaveTabVisible, setIsLeaveTabVisible] = useState(false);
  const [isTimeTabVisible, setIsTimeTabVisible] = useState(false);
  const [isSuperAdminEditFlow, setIsSuperAdminEditFlow] = useState(false);
  const [_, setHasUploadStarted] = useState(false);
  const [formType, setFormType] = useState<EditAllInformationType>(
    EditAllInformationType.personal
  );

  const [updateEmployeeStatus, setUpdateEmployeeStatus] =
    useState<EditAllInformationFormStatus>(
      EditAllInformationFormStatus.PENDING
    );

  const [isDiscardChangesModal, setIsDiscardChangesModal] =
    useState<DiscardChangeModalType>({
      isModalOpen: false,
      modalType: "",
      modalOpenedFrom: ""
    });

  const [isProbation, setIsProbation] = useState<boolean>(
    (employee?.contractState === contractStates.PROBATION &&
      Boolean(employee?.periodResponseDto)) ||
      false
  );

  const { data: supervisedData, isLoading: supervisorDataLoading } =
    useGetSupervisedByMe(Number(id));

  const steps = [
    translateText(["editAllInfo", "personal"]),
    translateText(["editAllInfo", "emergency"]),
    translateText(["editAllInfo", "employment"]),
    translateText(["editAllInfo", "systemPermissions"]),
    // translateText(["editAllInfo", "timeline"]),
    ...(isLeaveTabVisible &&
    data?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE)
      ? [translateText(["editAllInfo", "leave"])]
      : []),
    ...(isTimeTabVisible &&
    data?.user?.roles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE)
      ? [translateText(["editAllInfo", "timesheet"])]
      : [])
  ];

  const setSuperAdminIncompleteToasts = () => {
    let toastMessageDescription = "";
    const formType = superAdminRedirectSteps(
      employeeGeneralDetails,
      employeeContactDetails,
      employeeEmergencyContactDetails,
      employeeEmploymentDetails
    );
    if (formType === EditAllInformationType.personal) {
      toastMessageDescription = translateToastText([
        "incompleteSuperAdminToastDescriptionPersonal"
      ]);
    }
    if (formType === EditAllInformationType.emergency) {
      toastMessageDescription = translateToastText([
        "incompleteSuperAdminToastDescriptionEmergency"
      ]);
    }
    if (formType === EditAllInformationType.employment) {
      toastMessageDescription = translateToastText([
        "incompleteSuperAdminToastDescriptionEmployment"
      ]);
    }
    setToastMessage({
      toastType: ToastType.WARN,
      title: translateToastText(["incompleteSuperAdminToastTitle"]),
      description: toastMessageDescription,
      open: true
    });
  };

  const onSuccess = async () => {
    setIsReinviteConfirmationModalOpen(false);
    if (isDiscardChangesModal.isModalOpen) {
      setUpdateEmployeeStatus(EditAllInformationFormStatus.UPDATED);
    } else {
      setUpdateEmployeeStatus(EditAllInformationFormStatus.PENDING);
    }

    await refetchEmployeeData();

    if (isAdmin) {
      const redirectStep = superAdminRedirectSteps(
        employeeGeneralDetails,
        employeeContactDetails,
        employeeEmergencyContactDetails,
        employeeEmploymentDetails
      );

      if (
        redirectStep &&
        isDiscardChangesModal?.modalType !== DiscardTypeEnums.LEAVE_TAB
      ) {
        setSuperAdminIncompleteToasts();
        setToastMessage({
          toastType: ToastType.SUCCESS,
          title: translateToastText(["editToastTitle"]),
          description: translateToastText(["editToastDescription"]),
          open: true
        });
        setFormType(redirectStep);
        return;
      }
    }

    setToastMessage({
      toastType: ToastType.SUCCESS,
      title: translateToastText(["editToastTitle"]),
      description: translateToastText(["editToastDescription"]),
      open: true
    });
  };

  const onError = (error: string) => {
    setUpdateEmployeeStatus(EditAllInformationFormStatus.UPDATE_ERROR);
    const toastContent = {
      toastType: ToastType.ERROR,
      title: translateErrors(["title"]),
      description: translateErrors(["description"], {
        employee: employee?.name ?? translateErrors(["employee"])
      }),
      open: true
    };
    const errors = {
      [EditAllInfoErrorTypes.REALOCATE_INDIVIDUAL_SUPERVISOR_ERROR]:
        translateErrors(["realocateIndividualSupervisorError"]),
      [EditAllInfoErrorTypes.REALOCATE_TEAM_SUPERVISOR_ERROR]: translateErrors([
        "realocateTeamSupervisorError"
      ]),
      [EditAllInfoErrorTypes.REALOCATE_INIDIVIDUAL_AND_TEAM_SUPERVISOR_ERROR]:
        translateErrors(["realocateIndividualAndTeamSupervisorError"]),
      [EditAllInfoErrorTypes.UPLOAD_PROFILE_PICTURE_ERROR]: translateErrors([
        "uploadError"
      ])
    };
    toastContent.description =
      errors[error as EditAllInfoErrorTypes] ?? toastContent.description;
    setToastMessage(toastContent);
  };

  const {
    mutate,
    isPending: isEditingEmployeeLoading,
    isSuccess: isEditingEmployeeSuccess
  } = useHandleEditNewResource(onSuccess, onError);

  const {
    mutate: updatePeopleManager,
    isPending: isEditingPeopleManagerLoading,
    isSuccess: isEditingPeopleManagerSuccess
  } = useUpdateLeaveManagerData(id as string, onSuccess, onError);

  const isPeopleManagerMe =
    isPeopleManager &&
    currentEmployeeDetails?.employeeId === (id?.toString() ?? "");

  const { mutateAsync: imageUploadMutate } = useUploadImages();

  const goBack = () => {
    resetEmployeeData();
    resetEmployeeDataChanges();
    router.back();
  };

  const handleBackBtnClick = () =>
    isValuesChanged() && isSuccess && !isDiscardChangesModal.isModalOpen
      ? setIsDiscardChangesModal({
          isModalOpen: true,
          modalType: DiscardTypeEnums.LEAVE_FORM,
          modalOpenedFrom: formType
        })
      : goBack();

  const handleCancelBtnClick = () => {
    if (isValuesChanged() && isSuccess) {
      setIsDiscardChangesModal({
        isModalOpen: true,
        modalType: DiscardTypeEnums.CANCEL_FORM,
        modalOpenedFrom: formType
      });
    }
  };

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isValuesChanged()) {
      e.preventDefault();
      return "";
    }
  };

  const handleRouteChange = () => {
    if (isValuesChanged() && !isDiscardChangesModal.isModalOpen) {
      setIsDiscardChangesModal({
        isModalOpen: true,
        modalType: DiscardTypeEnums.LEAVE_FORM,
        modalOpenedFrom: formType
      });
      router.events.emit("routeChangeError");
      throw "routeChange aborted";
    }
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleRouteChange, handleBeforeUnload]);

  const handleComponentChange = (step: EditAllInformationType) => {
    if (isValuesChanged() && isSuccess) {
      setIsDiscardChangesModal({
        isModalOpen: true,
        modalType: DiscardTypeEnums.LEAVE_TAB,
        modalOpenedFrom: step
      });
    } else {
      setFormType(step);
    }
  };

  const handleSave = async () => {
    if (
      employeeEmploymentDetails.workEmail !== employee?.email &&
      !isReinviteConfirmationModalOpen
    ) {
      setIsReinviteConfirmationModalOpen(true);
      return;
    }
    let newAuthPicURL = "";
    if (
      typeof employeeGeneralDetails?.authPic === "object" &&
      employeeGeneralDetails?.authPic &&
      employeeGeneralDetails?.authPic?.length > 0
    ) {
      try {
        setHasUploadStarted(true);

        if (environment === appModes.COMMUNITY) {
          const formData = new FormData();
          formData.append("file", employeeGeneralDetails?.authPic[0]);

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
            employeeGeneralDetails?.authPic[0],
            FileCategories.PROFILE_PICTURES
          );

          if (employee?.authPic) {
            deleteFileFromS3(employee?.authPic as string);
          }
        }

        setHasUploadStarted(false);
      } catch (error) {
        onError(EditAllInfoErrorTypes.UPLOAD_PROFILE_PICTURE_ERROR);
      }
    } else {
      newAuthPicURL = (employeeGeneralDetails?.authPic as string) ?? "";
    }

    setEmployeeGeneralDetails("authPic", newAuthPicURL);
    const updatedEmployeeData: EmployeeType = {
      employeeId: employee?.employeeId as string,
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

    if (isAdmin) {
      setIsSuperAdminEditFlow(true);
    }
    isPeopleManagerMe
      ? updatePeopleManager(updatedEmployeeData)
      : mutate(updatedEmployeeData);
  };

  const isInputsDisabled =
    employee?.employmentStatus ===
      AccountStatusEnums.TERMINATED.toUpperCase() ||
    (!isPeopleAdmin && !isPeopleManagerMe);

  const getComponent = useCallback(() => {
    switch (formType) {
      case EditAllInformationType.personal:
        return (
          <PersonalDetailsForm
            onNext={handleSave}
            onBack={handleCancelBtnClick}
            isUpdate
            isSubmitDisabled={!isValuesChanged()}
            isLoading={false}
            updateEmployeeStatus={updateEmployeeStatus}
            setUpdateEmployeeStatus={setUpdateEmployeeStatus}
            isSuperAdminEditFlow={
              isSuperAdminEditFlow &&
              superAdminRedirectSteps(
                employeeGeneralDetails,
                employeeContactDetails,
                employeeEmergencyContactDetails,
                employeeEmploymentDetails
              ) !== null
            }
            isInputsDisabled={isInputsDisabled}
          />
        );
      case EditAllInformationType.emergency:
        return (
          <EmergencyDetailsForm
            onNext={handleSave}
            onBack={handleCancelBtnClick}
            isUpdate
            isSubmitDisabled={!isValuesChanged()}
            isLoading={false}
            updateEmployeeStatus={updateEmployeeStatus}
            setUpdateEmployeeStatus={setUpdateEmployeeStatus}
            isSuperAdminEditFlow={
              isSuperAdminEditFlow &&
              superAdminRedirectSteps(
                employeeGeneralDetails,
                employeeContactDetails,
                employeeEmergencyContactDetails,
                employeeEmploymentDetails
              ) !== null
            }
            isInputsDisabled={isInputsDisabled}
          />
        );
      case EditAllInformationType.employment:
        return (
          <EmploymentDetailsForm
            onNext={handleSave}
            onBack={handleCancelBtnClick}
            isUpdate
            isSubmitDisabled={!isValuesChanged()}
            isLoading={false}
            updateEmployeeStatus={updateEmployeeStatus}
            setUpdateEmployeeStatus={setUpdateEmployeeStatus}
            isSuperAdminEditFlow={
              isSuperAdminEditFlow &&
              superAdminRedirectSteps(
                employeeGeneralDetails,
                employeeContactDetails,
                employeeEmergencyContactDetails,
                employeeEmploymentDetails
              ) !== null
            }
            isInputsDisabled={isInputsDisabled}
          />
        );
      case EditAllInformationType.permission:
        return (
          <SystemPermissionForm
            onBack={handleCancelBtnClick}
            onNext={handleSave}
            onSave={handleSave}
            isLoading={false}
            isUpdate
            isSuccess={isSuccess}
            employee={employee}
            isInputsDisabled={isInputsDisabled}
          />
        );
      case EditAllInformationType.timeline:
        return <PeopleTimeline id={id ?? ""} />;
      case EditAllInformationType.leave:
        return (
          <IndividualEmployeeLeaveReportSection
            selectedUser={Number(id)}
            employeeLastName={employee?.lastName ?? ""}
            employeeFirstName={employee?.firstName ?? ""}
          />
        );
      case EditAllInformationType.timesheeet:
        return (
          <IndividualEmployeeTimeReportSection selectedUser={Number(id)} />
        );
      default:
        <PersonalDetailsForm
          onNext={handleSave}
          onBack={handleCancelBtnClick}
          isUpdate
          isSubmitDisabled={!isValuesChanged()}
          isLoading={false}
        />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    employee,
    formType,
    id,
    isEditingEmployeeSuccess,
    isEditingEmployeeLoading,
    isEditingPeopleManagerLoading,
    isEditingPeopleManagerSuccess,
    isProbation,
    handleBackBtnClick,
    mutate
  ]);

  useEffect(() => {
    setIsProbation(
      (employee?.contractState === contractStates.PROBATION &&
        Boolean(employee?.periodResponseDto)) ||
        false
    );
  }, [employee]);

  useEffect(() => {
    if (employeeDataChanges === 0 && employee) {
      setEmployeeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee, employeeDataChanges]);

  useEffect(() => {
    return () => {
      discardEmployeeData();
      setIsSuperAdminEditFlow(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab && tab === "timesheet") {
      setFormType(EditAllInformationType.timesheeet);
    } else if (tab === "leave") {
      setFormType(EditAllInformationType.leave);
    }
  }, [tab]);

  useEffect(() => {
    if (supervisedData && !supervisorDataLoading) {
      if (isLeaveAdmin) {
        setIsLeaveTabVisible(true);
      } else if (supervisedData && isLeaveManager) {
        const isManager =
          supervisedData.isPrimaryManager ||
          supervisedData.isSecondaryManager ||
          supervisedData.isTeamSupervisor;
        setIsLeaveTabVisible(isManager);
      }

      if (isAttendanceAdmin) {
        setIsTimeTabVisible(true);
      } else if (supervisedData && isAttendanceManager) {
        const isManager =
          supervisedData.isPrimaryManager ||
          supervisedData.isSecondaryManager ||
          supervisedData.isTeamSupervisor;
        setIsTimeTabVisible(isManager);
      }
    }
  }, [supervisorDataLoading, supervisedData]);

  return (
    <>
      <ContentLayout
        title={""}
        onBackClick={handleBackBtnClick}
        pageHead={""}
        isBackButtonVisible
        isDividerVisible={false}
        containerStyles={{
          gap: "0.75rem"
        }}
      >
        <Stack direction={"column"}>
          {employee ? (
            <EditInfoCard selectedEmployee={employee} />
          ) : (
            <EditInfoCardSkeleton />
          )}
          <BoxStepper
            activeStep={formType}
            steps={steps}
            onStepClick={(step) =>
              handleComponentChange(step as EditAllInformationType)
            }
            useStringIdentifier
            stepperStyles={{
              marginBottom: "1.75rem"
            }}
            isFullWidth
          />
          {isSuccess ? getComponent() : <EditAllInfoSkeleton />}
        </Stack>
      </ContentLayout>
      <ReinviteConfirmationModal
        onClose={() => setIsReinviteConfirmationModalOpen(false)}
        onClick={handleSave}
        title={translateText([
          "peoples",
          "workEmailChangingReinvitationConfirmationModalTitle"
        ])}
        description={translateText([
          "peoples",
          "workEmailChangingReinvitationConfirmationModalDescription"
        ])}
      />
      <TerminationModalController />
      {isDiscardChangesModal.isModalOpen && (
        <Modal
          open={isDiscardChangesModal.isModalOpen}
          onClose={() => {
            setIsDiscardChangesModal({
              isModalOpen: false,
              modalType: "",
              modalOpenedFrom: ""
            });
            setUpdateEmployeeStatus(EditAllInformationFormStatus.PENDING);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: ZIndexEnums.MODAL
          }}
        >
          <DiscardChangeApprovalModal
            setFormType={setFormType}
            isDiscardChangesModal={isDiscardChangesModal}
            setIsDiscardChangesModal={setIsDiscardChangesModal}
            functionOnLeave={setEmployeeData}
            updateEmployeeStatus={updateEmployeeStatus}
            setUpdateEmployeeStatus={setUpdateEmployeeStatus}
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

export default EditAllInformation;

import { Stack } from "@mui/material";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import IndividualEmployeeTimeReportSection from "~community/attendance/components/molecules/IndividualEmployeeTimeReportBody/IndividualEmployeeTimeReportBody";
import BoxStepper from "~community/common/components/molecules/BoxStepper/BoxStepper";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes, ManagerTypes } from "~community/common/types/AuthTypes";
import IndividualEmployeeLeaveReportSection from "~community/leave/components/molecules/IndividualEmployeeLeaveReportSection/IndividualEmployeeLeaveReportSection";
import EditAllInfoSkeleton from "~community/people/components/molecules/EditAllInfoSkeleton/EditAllInfoSkeleton";
import UserDetailsCentered from "~community/people/components/molecules/UserDetailsCentered/UserDetailsCentered";
import EmergencyDetailsForm from "~community/people/components/organisms/AddNewResourceFlow/EmergencyDetailsSection/EmergencyDetailsForm";
import PrimaryDetailsSection from "~community/people/components/organisms/AddNewResourceFlow/EmergencyDetailsSection/PrimaryDetailsSection";
import SecondaryDetailsSection from "~community/people/components/organisms/AddNewResourceFlow/EmergencyDetailsSection/SecondaryDetailsSection";
import EmploymentDetailsSection from "~community/people/components/organisms/AddNewResourceFlow/EmploymentDetailsSection/EmploymentDetailsSection";
import GeneralDetailsSection from "~community/people/components/organisms/AddNewResourceFlow/PersonalDetailsSection/GeneralDetailsSection";
import useGetEmployee from "~community/people/hooks/useGetEmployee";
import { usePeopleStore } from "~community/people/store/store";
import { EditAllInformationType } from "~community/people/types/EditEmployeeInfoTypes";
import { EmployeeDetails } from "~community/people/types/EmployeeTypes";

const Individual: NextPage = () => {
  const router = useRouter();
  const translateText = useTranslator("peopleModule");

  const { data } = useSession();
  const { tab } = router.query;

  const isLeaveManager = data?.user.roles?.includes(
    ManagerTypes.LEAVE_MANAGER || AdminTypes.LEAVE_ADMIN
  );

  const isAttendanceManager = data?.user.roles?.includes(
    ManagerTypes.ATTENDANCE_MANAGER || AdminTypes.ATTENDANCE_ADMIN
  );

  const isManager = isLeaveManager || isAttendanceManager;

  const [formType, setFormType] = useState<EditAllInformationType>(
    EditAllInformationType.personal
  );

  const { viewEmployeeId, isLeaveTabVisible, isTimeTabVisible } =
    usePeopleStore((state) => state);

  const {
    employee,
    isSuccess,
    isLoading,
    setEmployeeData
  }: {
    employee: EmployeeDetails | undefined;
    isSuccess: boolean;
    isLoading: boolean;
    setEmployeeData: () => void;
    refetchEmployeeData: () => Promise<void>;
    discardEmployeeData: () => void;
  } = useGetEmployee({ id: Number(viewEmployeeId) });

  const steps = [
    translateText(["editAllInfo", "personal"]),
    translateText(["editAllInfo", "employment"]),
    ...(isLeaveTabVisible ? [translateText(["editAllInfo", "leave"])] : []),
    ...(isTimeTabVisible ? [translateText(["editAllInfo", "timesheet"])] : [])
  ];

  const getComponent = useCallback(() => {
    switch (formType) {
      case EditAllInformationType.personal:
        return (
          <>
            <GeneralDetailsSection isManager={true} />
            {isManager && (
              <>
                <PrimaryDetailsSection isManager={true} />
                <SecondaryDetailsSection isManager={true} />
              </>
            )}
          </>
        );

      case EditAllInformationType.emergency:
        return (
          <EmergencyDetailsForm
            isUpdate={false}
            isSubmitDisabled={true}
            isLoading={false}
            onNext={function (): void {
              throw new Error("Function not implemented.");
            }}
            onBack={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        );
      case EditAllInformationType.employment:
        return (
          <>
            <EmploymentDetailsSection isManager={true} />
          </>
        );
      case EditAllInformationType.timesheeet:
        return (
          <>
            <IndividualEmployeeTimeReportSection
              selectedUser={Number(viewEmployeeId)}
            />
          </>
        );
      case EditAllInformationType.leave:
        return (
          <>
            <IndividualEmployeeLeaveReportSection
              selectedUser={Number(viewEmployeeId)}
              employeeLastName={employee?.lastName}
              employeeFirstName={employee?.firstName}
            />
          </>
        );
      default:
        <></>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee, formType, viewEmployeeId]);

  useEffect(() => {
    if (isSuccess) {
      setEmployeeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (tab && tab === "timesheet") {
      setFormType(EditAllInformationType.timesheeet);
    } else if (tab === "leave") {
      setFormType(EditAllInformationType.leave);
    }
  }, [tab]);

  return (
    <ContentLayout
      title={""}
      onBackClick={() => router.back()}
      pageHead={""}
      isBackButtonVisible
      isDividerVisible={false}
    >
      <Stack>
        <UserDetailsCentered
          selectedUser={employee as EmployeeDetails}
          styles={{
            marginBottom: "1rem",
            marginTop: "1.5rem"
          }}
          isLoading={isLoading}
          isSuccess={isSuccess}
          enableEdit={false}
        />
        <BoxStepper
          activeStep={formType}
          steps={steps}
          onStepClick={(step) => setFormType(step as EditAllInformationType)}
          useStringIdentifier
          stepperStyles={{
            marginBottom: "1.75rem"
          }}
        />
        {isSuccess ? getComponent() : <EditAllInfoSkeleton />}
      </Stack>
    </ContentLayout>
  );
};

export default Individual;

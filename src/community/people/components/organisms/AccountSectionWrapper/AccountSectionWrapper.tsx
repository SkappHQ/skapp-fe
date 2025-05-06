import { useEffect } from "react";

import { useGetEmployee } from "~community/people/api/PeopleApi";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import useNavigationGuard from "~community/people/hooks/useNavigationGuard";
import { usePeopleStore } from "~community/people/store/store";

import DirectorySteppers from "../../molecules/DirectorySteppers/DirectorySteppers";
import UnsavedChangesModal from "../../molecules/UnsavedChangesModal/UnsavedChangesModal";
import UserDetailsCentered from "../../molecules/UserDetailsCentered/UserDetailsCentered";
import PeopleAccountSection from "../PeopleAccountSection/PeopleAccountSection";

interface Props {
  employeeId: number;
}
const AccountSectionWrapper = ({ employeeId }: Props) => {
  const { data: employeeData } = useGetEmployee(employeeId);

  const {
    currentStep,
    nextStep,
    isUnsavedChangesModalOpen,
    employee,
    setIsUnsavedChangesModalOpen,
    setCurrentStep,
    setIsUnsavedModalSaveButtonClicked,
    setIsUnsavedModalDiscardButtonClicked,
    setEmployee
  } = usePeopleStore((state) => state);

  useEffect(() => {
    if (employeeData) {
      setEmployee(employeeData?.data?.results[0]);
    }
  }, [employeeData, setEmployee]);

  const { hasChanged } = useFormChangeDetector();

  const { proceedWithRouteChange } = useNavigationGuard({
    hasChanged,
    isUnsavedChangesModalOpen,
    setIsUnsavedChangesModalOpen
  });

  useEffect(() => {
    if (hasChanged && currentStep !== nextStep) {
      setIsUnsavedChangesModalOpen(true);
    } else {
      setCurrentStep(nextStep);
    }
  }, [
    currentStep,
    hasChanged,
    nextStep,
    setCurrentStep,
    setIsUnsavedModalSaveButtonClicked,
    setIsUnsavedModalDiscardButtonClicked,
    setIsUnsavedChangesModalOpen
  ]);

  return (
    <>
      {employee && (
        <UserDetailsCentered
          selectedUser={employee}
          styles={{
            marginBottom: "1rem",
            marginTop: "1.5rem"
          }}
          enableEdit={true}
        />
      )}
      <DirectorySteppers employeeId={employeeId} isAccountView />
      <PeopleAccountSection />
      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onDiscard={async () => {
          setIsUnsavedModalDiscardButtonClicked(true);
          await proceedWithRouteChange();
        }}
        onSave={async () => {
          setIsUnsavedModalSaveButtonClicked(true);
          await proceedWithRouteChange();
        }}
      />
    </>
  );
};

export default AccountSectionWrapper;

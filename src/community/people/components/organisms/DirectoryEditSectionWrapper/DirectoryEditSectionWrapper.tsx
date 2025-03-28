import { Box } from "@mui/material";
import { useEffect } from "react";

import { useGetEmployee } from "~community/people/api/PeopleApi";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import { usePeopleStore } from "~community/people/store/store";

import DirectorySteppers from "../../molecules/DirectorySteppers/DirectorySteppers";
import EditAllInfoSkeleton from "../../molecules/EditAllInfoSkeleton/EditAllInfoSkeleton";
import EditInfoCard from "../../molecules/EditInfoCard/EditInfoCard";
import EditInfoCardSkeleton from "../../molecules/EditInfoCard/EditInfoCardSkeleton";
import RouteChangeAreYouSureModal from "../../molecules/RouteChangeAreYouSureModal/RouteChangeAreYouSureModal";
import TerminationModalController from "../../molecules/TerminationModalController/TerminationModalController";
import UnsavedChangesModal from "../../molecules/UnsavedChangesModal/UnsavedChangesModal";
import UserDeletionModalController from "../../molecules/UserDeletionModalController/UserDeletionModalController";
import PeopleFormSections from "../PeopleFormSections/PeopleFormSections";

interface Props {
  employeeId: number;
}

const DirectoryEditSectionWrapper = ({ employeeId }: Props) => {
  const { data: employee, isLoading } = useGetEmployee(employeeId);

  const {
    isUnsavedChangesModalOpen,
    currentStep,
    nextStep,
    setIsUnsavedChangesModalOpen,
    setCurrentStep,
    setIsUnsavedModalSaveButtonClicked,
    setIsUnsavedModalDiscardButtonClicked,
    setEmployee
  } = usePeopleStore((state) => state);

  useEffect(() => {
    if (employee) {
      setEmployee(employee?.data?.results[0]);
    }
  }, [employee, setEmployee]);

  const { hasChanged } = useFormChangeDetector();

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
      <Box sx={{ mt: "0.75rem" }}>
        {isLoading ? <EditInfoCardSkeleton /> : <EditInfoCard />}
      </Box>
      <DirectorySteppers employeeId={Number(employeeId)} />
      {isLoading ? (
        <EditAllInfoSkeleton />
      ) : (
        <PeopleFormSections employeeId={Number(employeeId)} />
      )}
      <TerminationModalController />
      <UserDeletionModalController />
      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onDiscard={() => {
          setIsUnsavedModalDiscardButtonClicked(true);
        }}
        onSave={() => {
          setIsUnsavedModalSaveButtonClicked(true);
        }}
      />
      <RouteChangeAreYouSureModal />
    </>
  );
};

export default DirectoryEditSectionWrapper;

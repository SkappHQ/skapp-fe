import { Box } from "@mui/material";
import { useEffect } from "react";

import { useGetEmployeeById } from "~community/people/api/PeopleApi";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import { usePeopleStore } from "~community/people/store/store";

import DirectorySteppers from "../../molecules/DirectorySteppers/DirectorySteppers";
import EditInfoCard from "../../molecules/EditInfoCard/EditInfoCard";
import UnsavedChangesModal from "../../molecules/UnsavedChangesModal/UnsavedChangesModal";
import PeopleFormSections from "../PeopleFormSections/PeopleFormSections";

interface Props {
  employeeId: number;
}

const DirectoryEditSectionWrapper = ({ employeeId }: Props) => {
  const { data: employee } = useGetEmployeeById(employeeId);

  const {
    setIsSaveButtonClicked,
    isUnsavedChangesModalOpen,
    currentStep,
    nextStep,
    setIsUnsavedChangesModalOpen,
    setCurrentStep
  } = usePeopleStore((state) => state);

  const hasChanged = useFormChangeDetector();

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
    setIsSaveButtonClicked,
    setIsUnsavedChangesModalOpen
  ]);

  return (
    <>
      <Box sx={{ mt: "0.75rem" }}>
        {employee && <EditInfoCard selectedEmployee={employee} />}
      </Box>
      <DirectorySteppers employeeId={Number(employeeId)} />
      <PeopleFormSections />
      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onDiscard={() => {}}
        onSave={() => {
          setIsSaveButtonClicked(true);
        }}
      />
    </>
  );
};

export default DirectoryEditSectionWrapper;

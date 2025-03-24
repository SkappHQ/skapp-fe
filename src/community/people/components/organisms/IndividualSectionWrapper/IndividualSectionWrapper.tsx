import { useEffect } from "react";

import { useGetEmployeeById } from "~community/people/api/PeopleApi";
import { usePeopleStore } from "~community/people/store/store";

import DirectorySteppers from "../../molecules/DirectorySteppers/DirectorySteppers";
import UserDetailsCentered from "../../molecules/UserDetailsCentered/UserDetailsCentered";
import PeopleIndividualSection from "../PeopleIndividualSection/PeopleIndividualSection";

interface Props {
  employeeId: number;
}

const IndividualSectionWrapper = ({ employeeId }: Props) => {
  const {
    data: employee,
    isLoading,
    isSuccess
  } = useGetEmployeeById(employeeId);

  const { currentStep, nextStep, setCurrentStep } = usePeopleStore(
    (state) => state
  );

  useEffect(() => {
    if (currentStep !== nextStep) {
      setCurrentStep(nextStep);
    }
  }, [currentStep, nextStep, setCurrentStep]);

  return (
    <>
      {employee && (
        <UserDetailsCentered
          selectedUser={employee}
          styles={{
            marginBottom: "1rem",
            marginTop: "1.5rem"
          }}
          isLoading={isLoading}
          isSuccess={isSuccess}
          enableEdit={false}
        />
      )}
      <DirectorySteppers employeeId={Number(employeeId)} isIndividualView />
      <PeopleIndividualSection employeeId={Number(employeeId)} />
    </>
  );
};

export default IndividualSectionWrapper;

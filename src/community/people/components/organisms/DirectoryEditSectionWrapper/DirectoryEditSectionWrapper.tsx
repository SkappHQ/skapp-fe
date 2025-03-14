import { Box } from "@mui/material";
import { useState } from "react";

import { useGetEmployeeById } from "~community/people/api/PeopleApi";

import DirectorySteppers from "../../molecules/DirectorySteppers/DirectorySteppers";
import EditInfoCard from "../../molecules/EditInfoCard/EditInfoCard";
import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import PeopleFormSections from "../PeopleFormSections/PeopleFormSections";
import { EditPeopleFormTypes } from "~community/people/types/PeopleEditTypes";

interface Props {
  employeeId: number;
}

const DirectoryEditSectionWrapper = ({ employeeId }: Props) => {
  const [formType, setFormType] = useState<EditPeopleFormTypes>(
    EditPeopleFormTypes.personal
  );

  const { data: employee } = useGetEmployeeById(employeeId);

  return (
    <>
      <Box sx={{ mt: "0.75rem" }}>
        {employee && <EditInfoCard selectedEmployee={employee} />}
      </Box>
      <DirectorySteppers
        employeeId={Number(employeeId)}
        formType={formType}
        setFormType={setFormType}
      />
      <PeopleFormSections formType={formType} />
      {/* <EditSectionButtonWrapper
        onCancelClick={() => {}}
        onSaveClick={() => {}}
      /> */}
    </>
  );
};

export default DirectoryEditSectionWrapper;

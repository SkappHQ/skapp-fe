import { Box } from "@mui/material";
import { useState } from "react";

import { useGetEmployeeById } from "~community/people/api/PeopleApi";
import { EditPeopleFormTypes } from "~community/people/types/PeopleEditTypes";

import DirectorySteppers from "../../molecules/DirectorySteppers/DirectorySteppers";
import EditInfoCard from "../../molecules/EditInfoCard/EditInfoCard";
import PeopleFormSections from "../PeopleFormSections/PeopleFormSections";

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
      <PeopleFormSections formType={formType} setFormType={setFormType} />
    </>
  );
};

export default DirectoryEditSectionWrapper;

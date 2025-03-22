import { L3EmploymentDetailsType, L4ManagerType } from "../types/PeopleTypes";
import {
  ManagerRemoveType,
  ManagerSearchType,
  ManagerSelectType
} from "../types/employeeManagerHandlingTypes";

export const handleManagerSelect = async ({
  user,
  fieldName,
  formik,
  searchTermSetter,
  setSupervisor,
  setIsPopperOpen
}: ManagerSelectType): Promise<void> => {
  searchTermSetter("");
  formik.setFieldError(fieldName, "");
  await formik.setFieldValue(fieldName, user?.employeeId);

  setSupervisor({
    employmentDetails: {
      [fieldName]: {
        employeeId: user?.employeeId,
        firstName: user?.firstName,
        lastName: user?.lastName,
        authPic: user?.avatarUrl ?? ""
      },
      email: formik.values.email || ""
    }
  });

  setIsPopperOpen(false);
};
export const onManagerSearchChange = async ({
  managerType,
  e,
  setManagerSearchTerm,
  formik,
  setSupervisor
}: ManagerSearchType): Promise<void> => {
  setManagerSearchTerm(e.target.value.trimStart());
  await formik.setFieldValue(managerType, "");
  setSupervisor({
    employmentDetails: {
      [managerType]: {
        employeeId: 0,
        firstName: "",
        lastName: "",
        authPic: ""
      },
      email: formik.values.email || ""
    }
  });
};

export const onManagerRemove = async ({
  fieldName,
  formik,
  searchTermSetter,
  setSupervisor
}: ManagerRemoveType): Promise<void> => {
  searchTermSetter("");
  await formik.setFieldValue(fieldName, "");

  const prevManager =
    formik.initialValues[fieldName as keyof L3EmploymentDetailsType];

  setSupervisor({
    employmentDetails: {
      [fieldName]: {
        employeeId: (prevManager as L4ManagerType)?.employeeId ? -1 : undefined,
        firstName: "",
        lastName: "",
        authPic: ""
      },
      email: formik.values.email || ""
    }
  });
};

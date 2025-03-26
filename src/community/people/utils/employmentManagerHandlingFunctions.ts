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
  const currentEmploymentDetails = formik.values || {};

  setSupervisor({
    employmentDetails: {
      ...currentEmploymentDetails,
      [fieldName]: {
        employeeId: user?.employeeId,
        firstName: user?.firstName,
        lastName: user?.lastName,
        authPic: user?.avatarUrl ?? ""
      }
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
  const currentEmploymentDetails = formik.values || {};

  setSupervisor({
    employmentDetails: {
      ...currentEmploymentDetails,
      [managerType]: {
        employeeId: "",
        firstName: "",
        lastName: "",
        authPic: ""
      }
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

  const currentEmploymentDetails = formik.values || {};

  setSupervisor({
    employmentDetails: {
      ...currentEmploymentDetails,
      [fieldName]: {
        employeeId: (prevManager as L4ManagerType)?.employeeId ? -1 : undefined,
        firstName: "",
        lastName: "",
        authPic: ""
      }
    }
  });
};

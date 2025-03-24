import { useEffect, useState } from "react";

import { usePeopleStore } from "~community/people/store/store";

import { EditPeopleFormTypes } from "../types/PeopleEditTypes";

const useFormChangeDetector = (): boolean => {
  const [hasChanged, setHasChanged] = useState(false);
  const { employee, initialEmployee, currentStep } = usePeopleStore(
    (state) => state
  );

  useEffect(() => {
    if (!employee || !initialEmployee) {
      setHasChanged(false);
      return;
    }

    switch (currentStep) {
      case EditPeopleFormTypes.personal: {
        const personalHasChanged =
          JSON.stringify(employee.personal) !==
          JSON.stringify(initialEmployee.personal);
        setHasChanged(personalHasChanged);
        break;
      }
      case EditPeopleFormTypes.employment: {
        const employmentHasChanged =
          JSON.stringify(employee.employment) !==
          JSON.stringify(initialEmployee.employment);
        setHasChanged(employmentHasChanged);
        break;
      }
      case EditPeopleFormTypes.permission: {
        const contactHasChanged =
          JSON.stringify(employee.systemPermissions) !==
          JSON.stringify(initialEmployee.systemPermissions);
        setHasChanged(contactHasChanged);
        break;
      }
      case EditPeopleFormTypes.emergency: {
        const contactHasChanged =
          JSON.stringify(employee.emergency) !==
          JSON.stringify(initialEmployee.emergency);
        setHasChanged(contactHasChanged);
        break;
      }
    }
  }, [currentStep, employee, initialEmployee]);

  return hasChanged;
};

export default useFormChangeDetector;
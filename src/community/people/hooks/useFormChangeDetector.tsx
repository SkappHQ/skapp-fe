import { useEffect, useState } from "react";

import { usePeopleStore } from "~community/people/store/store";

import { EditPeopleFormTypes } from "../types/PeopleEditTypes";
import { L2PersonalDetailsType } from "../types/PeopleTypes";
import { getPersonalDetailsChanges } from "../utils/peopleEditFlowUtils";

const useFormChangeDetector = (): boolean => {
  const [hasChanged, setHasChanged] = useState(false);
  const { employee, initialEmployee, currentStep } = usePeopleStore(
    (state) => state
  );

  useEffect(() => {
    let apiPayload: Record<string, any> = {};

    switch (currentStep) {
      case EditPeopleFormTypes.personal: {
        const newPersonalDetails = employee?.personal as L2PersonalDetailsType;
        const previousPersonalDetails =
          initialEmployee?.personal as L2PersonalDetailsType;

        apiPayload = {
          ...apiPayload,
          ...getPersonalDetailsChanges(
            newPersonalDetails,
            previousPersonalDetails
          )
        };
        break;
      }
      case EditPeopleFormTypes.employment: {
        // Handle employment details changes
        break;
      }
      case EditPeopleFormTypes.permission: {
        // Handle permission details changes
        break;
      }
      case EditPeopleFormTypes.emergency: {
        // Handle emergency details changes
        break;
      }
      default:
        break;
    }

    if (Object.keys(apiPayload).length > 0) {
      setHasChanged(true);
    } else {
      setHasChanged(false);
    }
  }, [currentStep, employee, initialEmployee]);

  return hasChanged;
};

export default useFormChangeDetector;

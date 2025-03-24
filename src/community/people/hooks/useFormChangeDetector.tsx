import { useEffect, useState } from "react";

import { usePeopleStore } from "~community/people/store/store";

import { EditPeopleFormTypes } from "../types/PeopleEditTypes";
import { L1EmployeeType } from "../types/PeopleTypes";
import { getEmergencyContactDetailsChanges } from "../utils/peopleEditFlowUtils/emergencyDetailsChangesUtils";
import { getPersonalDetailsChanges } from "../utils/peopleEditFlowUtils/personalDetailsChangesUtils";

const useFormChangeDetector = (): {
  hasChanged: boolean;
  apiPayload: L1EmployeeType;
} => {
  const [state, setState] = useState<{
    hasChanged: boolean;
    apiPayload: L1EmployeeType;
  }>({
    hasChanged: false,
    apiPayload: {}
  });

  const { employee, initialEmployee, currentStep } = usePeopleStore(
    (state) => state
  );

  useEffect(() => {
    let newApiPayload: L1EmployeeType = {};

    switch (currentStep) {
      case EditPeopleFormTypes.personal: {
        const newPersonalDetails = employee?.personal;
        const previousPersonalDetails = initialEmployee?.personal;

        if (newPersonalDetails && previousPersonalDetails) {
          newApiPayload = {
            personal: {
              ...getPersonalDetailsChanges(
                newPersonalDetails,
                previousPersonalDetails
              )
            }
          };
        }
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
        const newEmergencyDetails = employee?.emergency;
        const previousEmergencyDetails = initialEmployee?.emergency;

        if (newEmergencyDetails && previousEmergencyDetails) {
          newApiPayload = {
            emergency: {
              ...getEmergencyContactDetailsChanges(
                newEmergencyDetails,
                previousEmergencyDetails
              )
            }
          };
        }
        break;
      }
      default:
        break;
    }

    console.log("newApiPayload", newApiPayload);

    const hasChanged = Object.keys(newApiPayload).length > 0;
    console.log("hasChanged", hasChanged);

    setState({
      hasChanged,
      apiPayload: {
        ...newApiPayload
      }
    });
  }, [currentStep, employee, initialEmployee]);

  return state;
};

export default useFormChangeDetector;

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
        const personalHasChanged = !isEqual(
          employee.personal,
          initialEmployee.personal
        );
        setHasChanged(personalHasChanged);
        break;
      }
      case EditPeopleFormTypes.employment: {
        const employmentHasChanged = !isEqual(
          employee.employment || {},
          initialEmployee.employment || {}
        );
        setHasChanged(employmentHasChanged);
        break;
      }
      case EditPeopleFormTypes.permission: {
        const contactHasChanged = !isEqual(
          employee.systemPermissions || {},
          initialEmployee.systemPermissions || {}
        );
        setHasChanged(contactHasChanged);
        break;
      }
      case EditPeopleFormTypes.emergency: {
        const contactHasChanged = !isEqual(
          employee.emergency || {},
          initialEmployee.emergency || {}
        );
        setHasChanged(contactHasChanged);
        break;
      }
    }

    const objectsHasChanged = !isEqual(employee, initialEmployee);

    setHasChanged(objectsHasChanged);
  }, [currentStep, employee, initialEmployee]);

  return hasChanged;
};

export default useFormChangeDetector;

function isEqual(
  obj1: Record<string, any>,
  obj2: Record<string, any>
): boolean {
  // Check if they're the same reference
  if (obj1 === obj2) return true;

  // If either is null or not an object, they can't be equal
  if (
    obj1 == null ||
    obj2 == null ||
    typeof obj1 !== "object" ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  // Get all keys from both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // If they have different number of keys, they're not equal
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Manual check for each key-value pair
  for (const key of keys1) {
    // Check if key exists in obj2
    if (!Object.hasOwn(obj2, key)) {
      return false;
    }

    const val1 = obj1[key];
    const val2 = obj2[key];

    // For primitive values, use strict equality
    if (typeof val1 !== "object" && typeof val2 !== "object") {
      if (val1 !== val2) {
        return false;
      }
      continue;
    }

    // If one is object and other isn't, they're not equal
    if (
      (typeof val1 === "object" && typeof val2 !== "object") ||
      (typeof val1 !== "object" && typeof val2 === "object")
    ) {
      return false;
    }

    // If both are null, they're equal
    if (val1 === null && val2 === null) {
      continue;
    }

    // If only one is null, they're not equal
    if (val1 === null || val2 === null) {
      return false;
    }

    // Handle arrays
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) {
        return false;
      }

      for (let i = 0; i < val1.length; i++) {
        // For primitive array elements, do direct comparison
        if (typeof val1[i] !== "object" && typeof val2[i] !== "object") {
          if (val1[i] !== val2[i]) {
            return false;
          }
        } else {
          // For object array elements, do manual comparison
          if (!isEqual(val1[i], val2[i])) {
            return false;
          }
        }
      }
      continue;
    }

    // For other objects, recursively compare
    if (!isEqual(val1, val2)) {
      return false;
    }
  }

  return true;
}

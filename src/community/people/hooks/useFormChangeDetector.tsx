import { useEffect, useState } from "react";

import { usePeopleStore } from "~community/people/store/store";

const isDeepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === null || obj2 === null) return obj1 === obj2;
  if (typeof obj1 !== "object" || typeof obj2 !== "object")
    return obj1 === obj2;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;

    if (!isDeepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

const useFormChangeDetector = (): boolean => {
  const [hasChanged, setHasChanged] = useState(false);
  const { employee, initialEmployee, setHasFormChanges } = usePeopleStore(
    (state) => state
  );

  useEffect(() => {
    if (!employee || !initialEmployee) {
      setHasFormChanges(false);
      setHasChanged(false);
      return;
    }

    const objectsHasChanged = !isDeepEqual(employee, initialEmployee);

    setHasChanged(objectsHasChanged);
    setHasFormChanges(objectsHasChanged);
  }, [employee, initialEmployee, setHasFormChanges]);

  return hasChanged;
};

export default useFormChangeDetector;

import {
  L2EmploymentFormDetailsType,
  L3CareerProgressionDetailsType,
  L3EmploymentDetailsType,
  L3IdentificationAndDiversityDetailsType,
  L3PreviousEmploymentDetailsType,
  L3VisaDetailsType
} from "~community/people/types/PeopleTypes";

import { isFieldDifferentAndValid } from "./personalDetailsChangesUtils";

export const isArrayFieldDifferentAndValid = (
  newArray: number[] | undefined,
  previousArray: number[] | undefined
): boolean => {
  // Check if both arrays are empty or undefined
  if (
    (newArray === undefined || newArray === null || newArray?.length === 0) &&
    (previousArray === undefined ||
      previousArray === null ||
      previousArray?.length === 0)
  ) {
    return false;
  } else if (!newArray || !previousArray) {
    // One is defined and the other isn't
    return true;
  } else if (newArray.length !== previousArray.length) {
    // Arrays have different lengths
    return true;
  } else {
    // Check if any element in newArray is not in previousArray
    return (
      newArray.some((item) => !previousArray.includes(item)) ||
      previousArray.some((item) => !newArray.includes(item))
    );
  }
};

export const getEmploymentChanges = (
  newEmployment: L3EmploymentDetailsType,
  previousEmployement: L3EmploymentDetailsType
): L3EmploymentDetailsType => {
  const changes: L3EmploymentDetailsType = {};

  if (
    isFieldDifferentAndValid(
      newEmployment?.employeeNumber,
      previousEmployement?.employeeNumber
    )
  ) {
    changes.employeeNumber = newEmployment?.employeeNumber;
  }

  if (
    isFieldDifferentAndValid(newEmployment?.email, previousEmployement?.email)
  ) {
    changes.email = newEmployment?.email;
  }

  if (
    isFieldDifferentAndValid(
      newEmployment?.employmentAllocation,
      previousEmployement?.employmentAllocation
    )
  ) {
    changes.employmentAllocation = newEmployment?.employmentAllocation;
  }

  if (
    isArrayFieldDifferentAndValid(
      newEmployment?.teamIds,
      previousEmployement?.teamIds
    )
  ) {
    changes.teamIds = newEmployment?.teamIds;
  }

  if (
    isFieldDifferentAndValid(
      newEmployment?.primarySupervisor?.employeeId?.toString(),
      previousEmployement?.primarySupervisor?.employeeId?.toString()
    )
  ) {
    changes.primarySupervisor = newEmployment?.primarySupervisor;
  }

  if (
    isFieldDifferentAndValid(
      newEmployment?.secondarySupervisor?.employeeId?.toString(),
      previousEmployement?.secondarySupervisor?.employeeId?.toString()
    )
  ) {
    changes.secondarySupervisor = newEmployment?.secondarySupervisor;
  }

  if (
    isFieldDifferentAndValid(
      newEmployment?.joinedDate,
      previousEmployement?.joinedDate
    )
  ) {
    changes.joinedDate = newEmployment?.joinedDate;
  }

  if (
    isFieldDifferentAndValid(
      newEmployment?.probationStartDate,
      previousEmployement?.probationStartDate
    )
  ) {
    changes.probationStartDate = newEmployment?.probationStartDate;
  }

  if (
    isFieldDifferentAndValid(
      newEmployment?.probationEndDate,
      previousEmployement?.probationEndDate
    )
  ) {
    changes.probationEndDate = newEmployment?.probationEndDate;
  }

  if (
    isFieldDifferentAndValid(
      newEmployment?.workTimeZone,
      previousEmployement?.workTimeZone
    )
  ) {
    changes.workTimeZone = newEmployment?.workTimeZone;
  }

  return changes;
};

export const getCareerProgressionChanges = (
  newCareer: L3CareerProgressionDetailsType[],
  previousCareer: L3CareerProgressionDetailsType[]
): L3CareerProgressionDetailsType[] => {
  if (newCareer === null || previousCareer === undefined) return [];

  // If the array lengths differ, return the entire new career array
  if (newCareer.length !== previousCareer.length) {
    return newCareer;
  }

  const changedItems: L3CareerProgressionDetailsType[] = [];

  // Create a map of previous career items by ID for quick lookup
  const previousCareerMap = previousCareer.reduce(
    (map, item) => {
      if (item.progressionId !== undefined) {
        map[item.progressionId] = item;
      }
      return map;
    },
    {} as Record<number, L3CareerProgressionDetailsType>
  );

  // Check each new career item for changes
  newCareer.forEach((newItem) => {
    if (newItem.progressionId === undefined) return;

    const previousItem = previousCareerMap[newItem.progressionId];
    if (!previousItem) return;

    // Create an object to hold changes for this item
    let hasChanges = false;
    const changedItem: L3CareerProgressionDetailsType = {
      progressionId: newItem.progressionId
    };

    // Check each field for changes
    if (
      isFieldDifferentAndValid(
        newItem.employmentType,
        previousItem.employmentType
      )
    ) {
      changedItem.employmentType = newItem.employmentType;
      hasChanges = true;
    }

    if (
      isFieldDifferentAndValid(newItem.jobFamilyId, previousItem.jobFamilyId)
    ) {
      changedItem.jobFamilyId = newItem.jobFamilyId;
      hasChanges = true;
    }

    if (isFieldDifferentAndValid(newItem.jobTitleId, previousItem.jobTitleId)) {
      changedItem.jobTitleId = newItem.jobTitleId;
      hasChanges = true;
    }

    if (isFieldDifferentAndValid(newItem.startDate, previousItem.startDate)) {
      changedItem.startDate = newItem.startDate;
      hasChanges = true;
    }

    if (isFieldDifferentAndValid(newItem.endDate, previousItem.endDate)) {
      changedItem.endDate = newItem.endDate;
      hasChanges = true;
    }

    if (
      isFieldDifferentAndValid(
        newItem.isCurrentEmployment,
        previousItem.isCurrentEmployment
      )
    ) {
      changedItem.isCurrentEmployment = newItem.isCurrentEmployment;
      hasChanges = true;
    }

    if (hasChanges) {
      changedItems.push(changedItem);
    }
  });

  return changedItems;
};

export const getIdentificationDetailsChanges = (
  newIdentificationDetails: L3IdentificationAndDiversityDetailsType,
  previousIdentificationDetails: L3IdentificationAndDiversityDetailsType
): L3IdentificationAndDiversityDetailsType => {
  const changes: L3IdentificationAndDiversityDetailsType = {};

  if (
    newIdentificationDetails === null ||
    previousIdentificationDetails === null
  )
    return changes;

  if (
    isFieldDifferentAndValid(
      newIdentificationDetails.ssn,
      previousIdentificationDetails.ssn
    )
  ) {
    changes.ssn = newIdentificationDetails.ssn;
  }

  if (
    isFieldDifferentAndValid(
      newIdentificationDetails.ethnicity,
      previousIdentificationDetails.ethnicity
    )
  ) {
    changes.ethnicity = newIdentificationDetails.ethnicity;
  }

  if (
    isFieldDifferentAndValid(
      newIdentificationDetails.eeoJobCategory,
      previousIdentificationDetails.eeoJobCategory
    )
  ) {
    changes.eeoJobCategory = newIdentificationDetails.eeoJobCategory;
  }

  return changes;
};

export const getPreviousEmploymentChanges = (
  newEmployments: L3PreviousEmploymentDetailsType[],
  previousEmployments: L3PreviousEmploymentDetailsType[]
): L3PreviousEmploymentDetailsType[] => {
  if (newEmployments === null || previousEmployments === null) return [];
  // If the array lengths differ, return the entire new array
  if (newEmployments.length !== previousEmployments.length) {
    return newEmployments;
  }

  const changedEmployments: L3PreviousEmploymentDetailsType[] = [];

  // Create a map of previous employments by ID for quick lookup
  const previousEmploymentMap = previousEmployments.reduce(
    (map, employment) => {
      if (employment.employmentId !== undefined) {
        map[employment.employmentId] = employment;
      }
      return map;
    },
    {} as Record<number, L3PreviousEmploymentDetailsType>
  );

  // Check each new employment for changes
  newEmployments.forEach((newEmployment) => {
    if (newEmployment.employmentId === undefined) return;

    const previousEmployment =
      previousEmploymentMap[newEmployment.employmentId];

    if (!previousEmployment) return;

    let hasChanges = false;

    const changedEmployment: L3PreviousEmploymentDetailsType = {
      employmentId: newEmployment.employmentId
    };

    if (
      isFieldDifferentAndValid(
        newEmployment.companyName,
        previousEmployment.companyName
      )
    ) {
      changedEmployment.companyName = newEmployment.companyName;
      hasChanges = true;
    }

    if (
      isFieldDifferentAndValid(
        newEmployment.jobTitle,
        previousEmployment.jobTitle
      )
    ) {
      changedEmployment.jobTitle = newEmployment.jobTitle;
      hasChanges = true;
    }

    if (
      isFieldDifferentAndValid(
        newEmployment.startDate,
        previousEmployment.startDate
      )
    ) {
      changedEmployment.startDate = newEmployment.startDate;
      hasChanges = true;
    }

    if (
      isFieldDifferentAndValid(
        newEmployment.endDate,
        previousEmployment.endDate
      )
    ) {
      changedEmployment.endDate = newEmployment.endDate;
      hasChanges = true;
    }

    if (hasChanges) {
      changedEmployments.push(changedEmployment);
    }
  });

  return changedEmployments;
};

export const getVisaDetailsChanges = (
  newVisas: L3VisaDetailsType[],
  previousVisas: L3VisaDetailsType[]
): L3VisaDetailsType[] => {
  if (newVisas === null || previousVisas === null) return [];

  if (newVisas.length !== previousVisas.length) {
    return newVisas;
  }

  const changedVisas: L3VisaDetailsType[] = [];

  const previousVisaMap = previousVisas.reduce(
    (map, visa) => {
      if (visa.visaId !== undefined) {
        map[visa.visaId] = visa;
      }
      return map;
    },
    {} as Record<number, L3VisaDetailsType>
  );

  newVisas.forEach((newVisa) => {
    if (newVisa.visaId === undefined) return;

    const previousVisa = previousVisaMap[newVisa.visaId];
    if (!previousVisa) return;

    let hasChanges = false;
    const changedVisa: L3VisaDetailsType = {
      visaId: newVisa.visaId
    };

    if (isFieldDifferentAndValid(newVisa.visaType, previousVisa.visaType)) {
      changedVisa.visaType = newVisa.visaType;
      hasChanges = true;
    }

    if (
      isFieldDifferentAndValid(
        newVisa.issuingCountry,
        previousVisa.issuingCountry
      )
    ) {
      changedVisa.issuingCountry = newVisa.issuingCountry;
      hasChanges = true;
    }

    if (isFieldDifferentAndValid(newVisa.issuedDate, previousVisa.issuedDate)) {
      changedVisa.issuedDate = newVisa.issuedDate;
      hasChanges = true;
    }

    if (isFieldDifferentAndValid(newVisa.expiryDate, previousVisa.expiryDate)) {
      changedVisa.expiryDate = newVisa.expiryDate;
      hasChanges = true;
    }

    if (hasChanges) {
      changedVisas.push(changedVisa);
    }
  });

  return changedVisas;
};

export const getEmploymentDetailsChanges = (
  newEmployementDetails: L2EmploymentFormDetailsType,
  previousEmployementDetails: L2EmploymentFormDetailsType
): L2EmploymentFormDetailsType => {
  const changes: L2EmploymentFormDetailsType = {};

  const employmentChanges = getEmploymentChanges(
    newEmployementDetails.employmentDetails as L3EmploymentDetailsType,
    previousEmployementDetails.employmentDetails as L3EmploymentDetailsType
  );
  Object.assign(changes, employmentChanges);

  const careerProgressionChanges = getCareerProgressionChanges(
    newEmployementDetails.careerProgression as L3CareerProgressionDetailsType[],
    previousEmployementDetails.careerProgression as L3CareerProgressionDetailsType[]
  );
  Object.assign(changes, careerProgressionChanges);

  const identificationDetailsChanges = getIdentificationDetailsChanges(
    newEmployementDetails.identificationAndDiversityDetails as L3IdentificationAndDiversityDetailsType,
    previousEmployementDetails.identificationAndDiversityDetails as L3IdentificationAndDiversityDetailsType
  );
  Object.assign(changes, identificationDetailsChanges);

  const previousEmploymentChanges = getPreviousEmploymentChanges(
    newEmployementDetails.previousEmployment as L3PreviousEmploymentDetailsType[],
    previousEmployementDetails.previousEmployment as L3PreviousEmploymentDetailsType[]
  );
  Object.assign(changes, previousEmploymentChanges);

  const visaDetailsChanges = getVisaDetailsChanges(
    newEmployementDetails.visaDetails as L3VisaDetailsType[],
    previousEmployementDetails.visaDetails as L3VisaDetailsType[]
  );
  Object.assign(changes, visaDetailsChanges);

  return changes;
};

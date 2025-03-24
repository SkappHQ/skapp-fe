import { L2PersonalDetailsType } from "../types/PeopleTypes";

export const isFieldDifferentAndValid = (
  newValue: string | undefined | null,
  oldValue: string | undefined | null
): boolean => {
  return (
    newValue !== oldValue &&
    newValue !== undefined &&
    newValue !== null &&
    newValue !== ""
  );
};

export const getPersonalDetailsChanges = (
  newPersonalDetails: L2PersonalDetailsType,
  previousPersonalDetails: L2PersonalDetailsType
): Record<string, any> => {
  const changes: Record<string, any> = {};

  // General Details
  if (
    isFieldDifferentAndValid(
      newPersonalDetails.general?.firstName,
      previousPersonalDetails.general?.firstName
    )
  ) {
    changes.firstName = newPersonalDetails.general?.firstName;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.general?.lastName,
      previousPersonalDetails.general?.lastName
    )
  ) {
    changes.lastName = newPersonalDetails.general?.lastName;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.general?.middleName,
      previousPersonalDetails.general?.middleName
    )
  ) {
    changes.middleName = newPersonalDetails.general?.middleName;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.general?.dateOfBirth,
      previousPersonalDetails.general?.dateOfBirth
    )
  ) {
    changes.dateOfBirth = newPersonalDetails.general?.dateOfBirth;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.general?.gender,
      previousPersonalDetails.general?.gender
    )
  ) {
    changes.gender = newPersonalDetails.general?.gender;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.general?.nationality,
      previousPersonalDetails.general?.nationality
    )
  ) {
    changes.nationality = newPersonalDetails.general?.nationality;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.general?.nin,
      previousPersonalDetails.general?.nin
    )
  ) {
    changes.nin = newPersonalDetails.general?.nin;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.general?.passportNumber,
      previousPersonalDetails.general?.passportNumber
    )
  ) {
    changes.passportNumber = newPersonalDetails.general?.passportNumber;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.general?.maritalStatus,
      previousPersonalDetails.general?.maritalStatus
    )
  ) {
    changes.maritalStatus = newPersonalDetails.general?.maritalStatus;
  }

  // Contact Details
  if (
    isFieldDifferentAndValid(
      newPersonalDetails.contact?.personalEmail,
      previousPersonalDetails.contact?.personalEmail
    )
  ) {
    changes.personalEmail = newPersonalDetails.contact?.personalEmail;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.contact?.contactNo,
      previousPersonalDetails.contact?.contactNo
    )
  ) {
    changes.contactNo = newPersonalDetails.contact?.contactNo;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.contact?.countryCode,
      previousPersonalDetails.contact?.countryCode
    )
  ) {
    changes.countryCode = newPersonalDetails.contact?.countryCode;
  }

  if (
    isFieldDifferentAndValid(
      newPersonalDetails.contact?.addressLine1,
      previousPersonalDetails.contact?.addressLine1
    )
  ) {
    changes.addressLine1 = newPersonalDetails.contact?.addressLine1;
  }

  return changes;
};

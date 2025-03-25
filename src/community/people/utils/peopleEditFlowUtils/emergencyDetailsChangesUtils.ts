import {
  L2EmergencyDetailsType,
  L3EmergencyContactType
} from "~community/people/types/PeopleTypes";

import { isFieldDifferentAndValid } from "./personalDetailsChangesUtils";

export const getEmergencyContactChanges = (
  newContact: L3EmergencyContactType,
  previousContact: L3EmergencyContactType
): Record<string, any> => {
  const changes: Record<string, any> = {};

  if (isFieldDifferentAndValid(newContact.name, previousContact.name)) {
    changes.name = newContact.name;
  }
  if (
    isFieldDifferentAndValid(
      newContact.relationship,
      previousContact.relationship
    )
  ) {
    changes.relationship = newContact.relationship;
  }
  if (
    isFieldDifferentAndValid(newContact.contactNo, previousContact.contactNo)
  ) {
    changes.contactNo = newContact.contactNo;
  }

  return changes;
};

export const getEmergencyContactDetailsChanges = (
  newEmergencyDetails: L2EmergencyDetailsType,
  previousEmergencyDetails: L2EmergencyDetailsType
): L2EmergencyDetailsType => {
  const changes: L2EmergencyDetailsType = {};

  if (
    newEmergencyDetails.primaryEmergencyContact &&
    previousEmergencyDetails.primaryEmergencyContact
  ) {
    const primaryContactChanges = getEmergencyContactChanges(
      newEmergencyDetails.primaryEmergencyContact,
      previousEmergencyDetails.primaryEmergencyContact
    );
    if (Object.keys(primaryContactChanges).length > 0) {
      changes.primaryEmergencyContact = primaryContactChanges;
    }
  }

  if (
    newEmergencyDetails.secondaryEmergencyContact &&
    previousEmergencyDetails.secondaryEmergencyContact
  ) {
    const secondaryContactChanges = getEmergencyContactChanges(
      newEmergencyDetails.secondaryEmergencyContact,
      previousEmergencyDetails.secondaryEmergencyContact
    );
    if (Object.keys(secondaryContactChanges).length > 0) {
      changes.secondaryEmergencyContact = secondaryContactChanges;
    }
  }

  return changes;
};

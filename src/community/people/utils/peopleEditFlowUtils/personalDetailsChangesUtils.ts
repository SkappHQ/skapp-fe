import {
  L2PersonalDetailsType,
  L3ContactDetailsType,
  L3EducationalDetailsType,
  L3FamilyDetailsType,
  L3GeneralDetailsType,
  L3HealthAndOtherDetailsType,
  L3SocialMediaDetailsType
} from "~community/people/types/PeopleTypes";

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

export const getGeneralDetailsChanges = (
  newGeneral: L3GeneralDetailsType,
  previousGeneral: L3GeneralDetailsType
): Partial<L3GeneralDetailsType> => {
  const changes: Partial<L3GeneralDetailsType> = {};

  if (
    isFieldDifferentAndValid(newGeneral?.firstName, previousGeneral?.firstName)
  ) {
    changes.firstName = newGeneral?.firstName;
  }

  if (
    isFieldDifferentAndValid(newGeneral?.lastName, previousGeneral?.lastName)
  ) {
    changes.lastName = newGeneral?.lastName;
  }

  if (
    isFieldDifferentAndValid(
      newGeneral?.middleName,
      previousGeneral?.middleName
    )
  ) {
    changes.middleName = newGeneral?.middleName;
  }

  if (
    isFieldDifferentAndValid(
      newGeneral?.dateOfBirth,
      previousGeneral?.dateOfBirth
    )
  ) {
    changes.dateOfBirth = newGeneral?.dateOfBirth;
  }

  if (isFieldDifferentAndValid(newGeneral?.gender, previousGeneral?.gender)) {
    changes.gender = newGeneral?.gender;
  }

  if (
    isFieldDifferentAndValid(
      newGeneral?.nationality,
      previousGeneral?.nationality
    )
  ) {
    changes.nationality = newGeneral?.nationality;
  }

  if (isFieldDifferentAndValid(newGeneral?.nin, previousGeneral?.nin)) {
    changes.nin = newGeneral?.nin;
  }

  if (
    isFieldDifferentAndValid(
      newGeneral?.passportNumber,
      previousGeneral?.passportNumber
    )
  ) {
    changes.passportNumber = newGeneral?.passportNumber;
  }

  if (
    isFieldDifferentAndValid(
      newGeneral?.maritalStatus,
      previousGeneral?.maritalStatus
    )
  ) {
    changes.maritalStatus = newGeneral?.maritalStatus;
  }

  return changes;
};

export const getContactDetailsChanges = (
  newContact: L3ContactDetailsType,
  previousContact: L3ContactDetailsType
): Partial<L3ContactDetailsType> => {
  const changes: Partial<L3ContactDetailsType> = {};

  if (
    isFieldDifferentAndValid(
      newContact?.personalEmail,
      previousContact?.personalEmail
    )
  ) {
    changes.personalEmail = newContact?.personalEmail;
  }

  if (
    isFieldDifferentAndValid(newContact?.contactNo, previousContact?.contactNo)
  ) {
    changes.contactNo = newContact?.contactNo;
  }

  if (
    isFieldDifferentAndValid(
      newContact?.countryCode,
      previousContact?.countryCode
    )
  ) {
    changes.countryCode = newContact?.countryCode;
  }

  if (
    isFieldDifferentAndValid(
      newContact?.addressLine1,
      previousContact?.addressLine1
    )
  ) {
    changes.addressLine1 = newContact?.addressLine1;
  }

  if (
    isFieldDifferentAndValid(
      newContact?.addressLine2,
      previousContact?.addressLine2
    )
  ) {
    changes.addressLine2 = newContact?.addressLine2;
  }

  if (isFieldDifferentAndValid(newContact?.city, previousContact?.city)) {
    changes.city = newContact?.city;
  }

  if (isFieldDifferentAndValid(newContact?.country, previousContact?.country)) {
    changes.country = newContact?.country;
  }

  if (isFieldDifferentAndValid(newContact?.state, previousContact?.state)) {
    changes.state = newContact?.state;
  }

  if (
    isFieldDifferentAndValid(
      newContact?.postalCode,
      previousContact?.postalCode
    )
  ) {
    changes.postalCode = newContact?.postalCode;
  }

  return changes;
};

export const getFamilyDetailsChanges = (
  newFamily: L3FamilyDetailsType[],
  previousFamily: L3FamilyDetailsType[]
): Record<string, any> => {
  const changes: Record<string, any> = {};

  if (newFamily.length !== previousFamily.length) {
    changes.family = newFamily;
    return changes;
  }

  const previousFamilyMap = previousFamily.reduce(
    (map, member) => {
      if (member.familyMemberId !== undefined) {
        map[member.familyMemberId] = member;
      }
      return map;
    },
    {} as Record<number, L3FamilyDetailsType>
  );

  newFamily.forEach((newMember) => {
    if (newMember.familyMemberId === undefined) return;

    const previousMember = previousFamilyMap[newMember.familyMemberId];

    if (!previousMember) return;

    const memberId = newMember.familyMemberId;

    if (
      isFieldDifferentAndValid(newMember.firstName, previousMember.firstName)
    ) {
      changes[`${memberId}.firstName`] = newMember.firstName;
    }

    if (isFieldDifferentAndValid(newMember.lastName, previousMember.lastName)) {
      changes[`${memberId}.lastName`] = newMember.lastName;
    }

    if (
      isFieldDifferentAndValid(
        newMember.relationship,
        previousMember.relationship
      )
    ) {
      changes[`${memberId}.relationship`] = newMember.relationship;
    }

    if (isFieldDifferentAndValid(newMember.gender, previousMember.gender)) {
      changes[`${memberId}.gender`] = newMember.gender;
    }

    if (
      isFieldDifferentAndValid(newMember.parentName, previousMember.parentName)
    ) {
      changes[`${memberId}.parentName`] = newMember.parentName;
    }

    if (
      isFieldDifferentAndValid(
        newMember.dateOfBirth,
        previousMember.dateOfBirth
      )
    ) {
      changes[`${memberId}.dateOfBirth`] = newMember.dateOfBirth;
    }
  });

  return changes;
};

export const getEducationalDetailsChanges = (
  newEducational: L3EducationalDetailsType[],
  previousEducational: L3EducationalDetailsType[]
): Record<string, any> => {
  const changes: Record<string, any> = {};

  if (newEducational.length !== previousEducational.length) {
    changes.educational = newEducational;
    return changes;
  }

  const previousEducationalMap = previousEducational.reduce(
    (map, education) => {
      if (education.educationId !== undefined) {
        map[education.educationId] = education;
      }
      return map;
    },
    {} as Record<number, L3EducationalDetailsType>
  );

  newEducational.forEach((newEducation) => {
    if (newEducation.educationId === undefined) return;

    const previousEducation = previousEducationalMap[newEducation.educationId];

    if (!previousEducation) return;

    const educationId = newEducation.educationId;

    if (
      isFieldDifferentAndValid(
        newEducation.institutionName,
        previousEducation.institutionName
      )
    ) {
      changes[`${educationId}.institutionName`] = newEducation.institutionName;
    }

    if (
      isFieldDifferentAndValid(newEducation.degree, previousEducation.degree)
    ) {
      changes[`${educationId}.degree`] = newEducation.degree;
    }

    if (isFieldDifferentAndValid(newEducation.major, previousEducation.major)) {
      changes[`${educationId}.major`] = newEducation.major;
    }

    if (
      isFieldDifferentAndValid(
        newEducation.startDate,
        previousEducation.startDate
      )
    ) {
      changes[`${educationId}.startDate`] = newEducation.startDate;
    }

    if (
      isFieldDifferentAndValid(newEducation.endDate, previousEducation.endDate)
    ) {
      changes[`${educationId}.endDate`] = newEducation.endDate;
    }
  });

  return changes;
};

export const getSocialMediaDetailsChanges = (
  newSocialMedia: L3SocialMediaDetailsType,
  previousSocialMedia: L3SocialMediaDetailsType
): Record<string, any> => {
  const changes: Record<string, any> = {};

  if (
    isFieldDifferentAndValid(
      newSocialMedia?.linkedin,
      previousSocialMedia?.linkedin
    )
  ) {
    changes.linkedin = newSocialMedia?.linkedin;
  }

  if (
    isFieldDifferentAndValid(
      newSocialMedia?.facebook,
      previousSocialMedia?.facebook
    )
  ) {
    changes.facebook = newSocialMedia?.facebook;
  }

  if (
    isFieldDifferentAndValid(
      newSocialMedia?.instagram,
      previousSocialMedia?.instagram
    )
  ) {
    changes.instagram = newSocialMedia?.instagram;
  }

  if (isFieldDifferentAndValid(newSocialMedia?.x, previousSocialMedia?.x)) {
    changes.x = newSocialMedia?.x;
  }

  return changes;
};

export const getHealthAndOtherDetailsChanges = (
  newHealthAndOther: L3HealthAndOtherDetailsType,
  previousHealthAndOther: L3HealthAndOtherDetailsType
): Record<string, any> => {
  const changes: Record<string, any> = {};

  if (
    isFieldDifferentAndValid(
      newHealthAndOther?.bloodGroup,
      previousHealthAndOther?.bloodGroup
    )
  ) {
    changes.bloodGroup = newHealthAndOther?.bloodGroup;
  }

  if (
    isFieldDifferentAndValid(
      newHealthAndOther?.allergies,
      previousHealthAndOther?.allergies
    )
  ) {
    changes.allergies = newHealthAndOther?.allergies;
  }

  if (
    isFieldDifferentAndValid(
      newHealthAndOther?.dietaryRestrictions,
      previousHealthAndOther?.dietaryRestrictions
    )
  ) {
    changes.dietaryRestrictions = newHealthAndOther?.dietaryRestrictions;
  }

  if (
    isFieldDifferentAndValid(
      newHealthAndOther?.tShirtSize,
      previousHealthAndOther?.tShirtSize
    )
  ) {
    changes.tShirtSize = newHealthAndOther?.tShirtSize;
  }

  return changes;
};

export const getPersonalDetailsChanges = (
  newPersonalDetails: L2PersonalDetailsType,
  previousPersonalDetails: L2PersonalDetailsType
): Record<string, any> => {
  const changes: Record<string, any> = {};

  // General Details
  const generalChanges = getGeneralDetailsChanges(
    newPersonalDetails.general as L3GeneralDetailsType,
    previousPersonalDetails.general as L3GeneralDetailsType
  );
  Object.assign(changes, generalChanges);

  // Contact Details
  const contactChanges = getContactDetailsChanges(
    newPersonalDetails.contact as L3ContactDetailsType,
    previousPersonalDetails.contact as L3ContactDetailsType
  );
  Object.assign(changes, contactChanges);

  // Family Details
  const familyChanges = getFamilyDetailsChanges(
    newPersonalDetails.family as L3FamilyDetailsType[],
    previousPersonalDetails.family as L3FamilyDetailsType[]
  ) as L3FamilyDetailsType[];

  Object.assign(changes, familyChanges);

  // Educational Details
  const educationalChanges = getEducationalDetailsChanges(
    newPersonalDetails.educational as L3EducationalDetailsType[],
    previousPersonalDetails.educational as L3EducationalDetailsType[]
  ) as L3EducationalDetailsType[];
  Object.assign(changes, educationalChanges);

  // Social Media Details
  const socialMediaChanges = getSocialMediaDetailsChanges(
    newPersonalDetails.socialMedia as L3SocialMediaDetailsType,
    previousPersonalDetails.socialMedia as L3SocialMediaDetailsType
  ) as L3SocialMediaDetailsType;
  Object.assign(changes, socialMediaChanges);

  // Health and Other Details
  const healthAndOtherChanges = getHealthAndOtherDetailsChanges(
    newPersonalDetails.healthAndOther as L3HealthAndOtherDetailsType,
    previousPersonalDetails.healthAndOther as L3HealthAndOtherDetailsType
  ) as L3HealthAndOtherDetailsType;
  Object.assign(changes, healthAndOtherChanges);

  return changes;
};

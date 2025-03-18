import {
  AccountStatusTypes,
  BloodGroupTypes,
  EEOJobCategoryTypes,
  EmploymentAllocationTypes,
  EmploymentTypes,
  EthnicityTypes,
  GenderEnum,
  MaritalStatusTypes,
  NationalityEnum,
  RelationshipTypes,
  Role
} from "../enums/PeopleEnums";

//L1 Type
export interface L1EmployeeType {
  personal: L2PersonalDetailsType;
  emergency?: L2EmergencyDetailsType;
  employment?: L2EmploymentFormDetailsType;
  systemPermissions?: L2SystemPermissionsType;
  common?: L2CommonDetailsType;
}

//L2 Types
export interface L2PersonalDetailsType {
  general: L3GeneralDetailsType;
  contact?: L3ContactDetailsType;
  family?: L3FamilyDetailsType[];
  educational?: L3EducationalDetailsType[];
  socialMedia?: L3SocialMediaDetailsType;
  healthAndOther?: L3HealthAndOtherDetailsType;
}

export interface L2EmergencyDetailsType {
  primaryEmergencyContact?: L3EmergencyContactType;
  secondaryEmergencyContact?: L3EmergencyContactType;
}

export interface L2EmploymentFormDetailsType {
  employmentDetails?: L3EmploymentDetailsType;
  careerProgression?: L3CareerProgressionDetailsType[];
  identificationAndDiversityDetails?: L3IdentificationAndDiversityDetailsType;
  previousEmployment?: L3PreviousEmploymentDetailsType[];
  visaDetails?: L3VisaDetailsType[];
}

export interface L2SystemPermissionsType {
  isSuperAdmin?: boolean;
  peopleRole?: Role;
  leaveRole?: Role;
  attendanceRole?: Role;
  eSignRole?: Role;
}

export interface L2CommonDetailsType {
  image?: string;
  accountStatus?: AccountStatusTypes;
  thumbnail?: string;
}

//L3 Types
export interface L3GeneralDetailsType {
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: GenderEnum;
  dateOfBirth?: Date;
  nationality?: NationalityEnum;
  nin?: string;
  passportNumber?: string;
  maritalStatus?: MaritalStatusTypes;
}

export interface L3ContactDetailsType {
  personalEmail?: string;
  countryCode?: string;
  contactNo?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  state?: string;
  postalCode?: string;
}

export interface L3FamilyDetailsType {
  firstName?: string;
  lastName?: string;
  gender?: GenderEnum;
  relationship?: RelationshipTypes;
  dateOfBirth?: Date;
  parentName?: string;
}

export interface L3EducationalDetailsType {
  institutionName?: string;
  degree?: string;
  major?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface L3SocialMediaDetailsType {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
}

export interface L3HealthAndOtherDetailsType {
  bloodGroup?: BloodGroupTypes;
  allergies?: string;
  dietaryRestrictions?: string;
  tShirtSize?: string;
}

export interface L3EmergencyContactType {
  name?: string;
  relationship?: RelationshipTypes;
  countryCode?: string;
  contactNo?: string;
}

export interface L3EmploymentDetailsType {
  employeeNumber?: string;
  email: string;
  employmentAllocation?: EmploymentAllocationTypes;
  teams?: number[];
  primarySupervisor?: L4ManagerType;
  secondarySupervisor?: L4ManagerType;
  joinedDate?: Date;
  probationStartDate?: Date;
  probationEndDate?: Date;
  workTimeZone?: string;
}

export interface L3CareerProgressionDetailsType {
  employmentType?: EmploymentTypes;
  jobFamily?: number;
  jobTitle?: number;
  startDate?: string;
  endDate?: string;
  isCurrentEmployment?: boolean;
}

export interface L3IdentificationAndDiversityDetailsType {
  ssn?: string;
  ethnicity?: EthnicityTypes;
  eeoJobCategory?: EEOJobCategoryTypes;
}

export interface L3PreviousEmploymentDetailsType {
  companyName?: string;
  jobTitle?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface L3VisaDetailsType {
  visaType?: string;
  issuingCountry?: string;
  issuedDate?: string;
  expiryDate?: string;
}

//L4 Types
export interface L4ManagerType {
  employeeId?: number;
  firstName?: string;
  lastName?: string;
  authPic?: string;
}

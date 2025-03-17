export interface EmployeeType {
  personal: PersonalDetailsType;
  emergency: EmergencyDetailsType;
  employment: EmploymentFormDetailsType;
  systemPermissions: SystemPermissionsType;
  common: CommonDetailsType;
}

export interface PersonalDetailsType {
  general: GeneralDetailsType;
  contact: ContactDetailsType;
  family: FamilyDetailsType[];
  educational: EducationalDetailsType[];
  socialMedia: SocialMediaDetailsType;
  healthAndOther: HealthAndOtherDetailsType;
}

export interface GeneralDetailsType {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  gender: GenderEnum | null;
  dateOfBirth: string | null;
  nationality: string | null;
  nin: string | null;
  passportNumber: string | null;
  maritalStatus: string | null;
}

export interface ContactDetailsType {
  personalEmail: string | null;
  countryCode: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  country: string | null;
  state: string | null;
  postalCode: string | null;
}

export interface FamilyDetailsType {
  firstName: string | null;
  lastName: string | null;
  gender: GenderEnum | null;
  relationship: RelationshipTypes | null;
  dateOfBirth: string | null;
  parentName: string | null;
}

export interface EducationalDetailsType {
  institutionName: string | null;
  degree: string | null;
  major: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface SocialMediaDetailsType {
  linkedin: string | null;
  facebook: string | null;
  instagram: string | null;
  x: string | null;
}

export interface HealthAndOtherDetailsType {
  bloodGroup: BloodGroupTypes | null;
  allergies: string | null;
  dietaryRestrictions: string | null;
  tshirtSize: string | null;
}

export interface EmergencyDetailsType {
  primaryEmergencyContact: EmergencyContactType;
  secondaryEmergencyContact: EmergencyContactType;
}

export interface EmergencyContactType {
  name: string | null;
  relationship: RelationshipTypes | null;
  countryCode: string | null;
  contactNumber: string | null;
}

export interface EmploymentFormDetailsType {
  employmentDetails: EmploymentDetailsType;
  careerProgression: CareerProgressionDetailsType[];
  identificationAndDiversityDetails: IdentificationAndDiversityDetailsType;
  previousEmployment: PreviousEmploymentDetailsType[];
  visaDetails: VisaDetailsType[];
}

export interface EmploymentDetailsType {
  employeeNumber: string | null;
  workEmail: string | null;
  employmentAllocation: EmploymentAllocationTypes | null;
  teams: number[] | null;
  employmentStatus: EmploymentStatusTypes;
  primarySupervisor: ManagerType | null;
  secondarySupervisor: ManagerType | null;
  joinedDate: string | null;
  probationStartDate: string | null;
  probationEndDate: string | null;
  workTimeZone: string | null;
}

export interface CareerProgressionDetailsType {
  employmentType: EmploymentTypes | null;
  jobFamily: number | string | null;
  jobTitle: number | string | null;
  startDate: string | null;
  endDate: string | null;
  currentEmployment: boolean | null;
}

export interface IdentificationAndDiversityDetailsType {
  ssn: string | null;
  ethnicity: EthnicityTypes | null;
  eeoJobCategory: EEOJobCategoryTypes | null;
}

export interface PreviousEmploymentDetailsType {
  companyName: string | null;
  jobTitle: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface VisaDetailsType {
  visaType: string | null;
  issuingCountry: string | null;
  issuedDate: string | null;
  expiryDate: string | null;
}

export interface SystemPermissionsType {
  isSuperAdmin: boolean;
  peopleRole: Role | null;
  leaveRole: Role | null;
  attendanceRole: Role | null;
  eSignRole: Role | null;
}

export interface CommonDetailsType {
  authPic: string | null;
}

export interface ManagerType {
  employeeId: string | number | undefined;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export enum GenderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export enum RelationshipTypes {
  SPOUSE = "SPOUSE",
  CHILD = "CHILD",
  PARENT = "PARENT",
  FAMILY = "FAMILY",
  FRIEND = "FRIEND",
  GUARDIAN = "GUARDIAN"
}

export enum BloodGroupTypes {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE"
}

export enum MaritalStatusTypes {
  MARRIED = "MARRIED",
  SINGLE = "SINGLE",
  SEPARATED = "SEPARATED",
  WIDOWED = "WIDOWED"
}

export enum EmploymentAllocationTypes {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME"
}

export enum EmploymentTypes {
  PERMANENT = "PERMANENT",
  INTERN = "INTERN",
  CONTRACT = "CONTRACT"
}

export enum EmploymentStatusTypes {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  TERMINATED = "TERMINATED"
}

export enum EEOJobCategoryTypes {
  EXECUTIVE = "EXECUTIVE_SENIOR_LEVEL_OFFICIALS_AND_MANAGERS",
  FIRST_MID_LEVEL = "FIRST_MID_LEVEL_OFFICIALS_AND_MANAGERS",
  PROFESSIONALS = "PROFESSIONALS",
  TECHNICIANS = "TECHNICIANS",
  SALES_WORKERS = "SALES_WORKERS",
  SUPPORT_WORKERS = "ADMINISTRATIVE_SUPPORT_WORKERS",
  CRAFT_WORKERS = "CRAFT_WORKERS",
  OPERATIVES = "OPERATIVES",
  LABORERS = "LABORERS_AND_HELPERS",
  SERVICE_WORKERS = "SERVICE_WORKERS"
}

export enum EthnicityTypes {
  AFRICAN = "AFRICAN",
  CARIBBEAN = "CARIBBEAN",
  INDIAN = "INDIAN",
  MELANESIAN = "MELANESIAN",
  AUSTRALASIAN_OR_ABORIGINAL = "AUSTRALASIAN_OR_ABORIGINAL",
  CHINESE = "CHINESE",
  GUAMANIAN = "GUAMANIAN",
  JAPANESE = "JAPANESE",
  KOREAN = "KOREAN",
  POLYNESIAN = "POLYNESIAN",
  EUROPEAN_OR_ANGLO_SAXON = "EUROPEAN_OR_ANGLO_SAXON",
  OTHER_PACIFIC_ISLANDER = "OTHER_PACIFIC_ISLANDER",
  LATIN_AMERICAN = "LATIN_AMERICAN",
  ARABIC = "ARABIC",
  VIETNAMESE = "VIETNAMESE",
  MICRONESIAN = "MICRONESIAN",
  DECLINED_TO_RESPOND = "DECLINED_TO_RESPOND",
  OTHER_HISPANIC = "OTHER_HISPANIC",
  US_OR_CANADIAN_INDIAN = "US_OR_CANADIAN_INDIAN",
  OTHER_ASIAN = "OTHER_ASIAN",
  PUERTO_RICAN = "PUERTO_RICAN",
  FILIPINO = "FILIPINO",
  MEXICAN = "MEXICAN",
  ALASKAN_NATIVE = "ALASKAN_NATIVE",
  CUBAN = "CUBAN"
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  PEOPLE_ADMIN = "PEOPLE_ADMIN",
  PEOPLE_MANAGER = "PEOPLE_MANAGER",
  PEOPLE_EMPLOYEE = "PEOPLE_EMPLOYEE",
  LEAVE_ADMIN = "LEAVE_ADMIN",
  LEAVE_MANAGER = "LEAVE_MANAGER",
  LEAVE_EMPLOYEE = "LEAVE_EMPLOYEE",
  ATTENDANCE_ADMIN = "ATTENDANCE_ADMIN",
  ATTENDANCE_MANAGER = "ATTENDANCE_MANAGER",
  ATTENDANCE_EMPLOYEE = "ATTENDANCE_EMPLOYEE",
  ESIGN_EMPLOYEE = "ESIGN_EMPLOYEE",
  ESIGN_SENDER = "ESIGN_SENDER",
  ESIGN_ADMIN = "ESIGN_ADMIN"
}

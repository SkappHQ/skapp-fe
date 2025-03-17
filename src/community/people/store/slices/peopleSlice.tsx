import { SetType } from "~community/common/types/CommonTypes";
import {
  L1EmployeeType,
  L2CommonDetailsType,
  L2EmergencyDetailsType,
  L2EmploymentFormDetailsType,
  L2PersonalDetailsType,
  L2SystemPermissionsType
} from "~community/people/types/PeopleTypes";
import { PeopleSliceTypes } from "~community/people/types/SliceTypes";

const defaultEmployee: L1EmployeeType = {
  personal: {
    general: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: undefined,
      nationality: undefined,
      nin: "",
      passportNumber: "",
      maritalStatus: undefined
    },
    contact: {
      personalEmail: "",
      countryCode: "",
      contactNo: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "",
      state: "",
      postalCode: ""
    },
    family: [],
    educational: [],
    socialMedia: {
      linkedin: "",
      facebook: "",
      instagram: "",
      x: ""
    },
    healthAndOther: {
      bloodGroup: undefined,
      allergies: "",
      dietaryRestrictions: "",
      tShirtSize: ""
    }
  },
  emergency: {
    primaryEmergencyContact: {
      name: "",
      relationship: undefined,
      countryCode: undefined,
      contactNo: ""
    },
    secondaryEmergencyContact: {
      name: "",
      relationship: undefined,
      countryCode: undefined,
      contactNo: ""
    }
  },
  employment: {
    employmentDetails: {
      employeeNumber: "",
      email: "",
      employmentAllocation: undefined,
      teams: undefined,
      primarySupervisor: undefined,
      secondarySupervisor: undefined,
      joinedDate: undefined,
      probationStartDate: undefined,
      probationEndDate: undefined,
      workTimeZone: undefined
    },
    careerProgression: [],
    identificationAndDiversityDetails: {
      ssn: "",
      ethnicity: undefined,
      eeoJobCategory: undefined
    },
    previousEmployment: [],
    visaDetails: []
  },
  systemPermissions: {
    isSuperAdmin: false,
    peopleRole: undefined,
    leaveRole: undefined,
    attendanceRole: undefined,
    eSignRole: undefined
  },
  common: {
    image: "",
    accountStatus: undefined
  }
};

const peopleSlice = (set: SetType<PeopleSliceTypes>): PeopleSliceTypes => ({
  employee: defaultEmployee,
  initialEmployee: defaultEmployee,
  setEmployee: (employee: L1EmployeeType) =>
    set(() => ({ employee, initialEmployee: employee })),
  setPersonalDetails: (personal: L2PersonalDetailsType) =>
    set((state: PeopleSliceTypes) => ({
      ...state,
      employee: {
        ...state.employee,
        personal: { ...state.employee.personal, ...personal }
      }
    })),
  setEmergencyDetails: (emergency: L2EmergencyDetailsType) =>
    set((state: PeopleSliceTypes) => ({
      ...state,
      employee: {
        ...state.employee,
        emergency: { ...state.employee.emergency, ...emergency }
      }
    })),
  setEmploymentDetails: (employment: L2EmploymentFormDetailsType) =>
    set((state: PeopleSliceTypes) => ({
      ...state,
      employee: {
        ...state.employee,
        employment: { ...state.employee.employment, ...employment }
      }
    })),
  setSystemPermissions: (systemPermissions: L2SystemPermissionsType) =>
    set((state: PeopleSliceTypes) => ({
      ...state,
      employee: {
        ...state.employee,
        systemPermissions: {
          ...state.employee.systemPermissions,
          ...systemPermissions
        }
      }
    })),
  setCommonDetails: (common: L2CommonDetailsType) =>
    set((state: PeopleSliceTypes) => ({
      ...state,
      employee: {
        ...state.employee,
        common: { ...state.employee.common, ...common }
      }
    }))
});

export default peopleSlice;

import { SetType } from "~community/common/types/CommonTypes";
import {
  CommonDetailsType,
  EmergencyDetailsType,
  EmployeeType,
  EmploymentFormDetailsType,
  PersonalDetailsType,
  SystemPermissionsType
} from "~community/people/types/PeopleTypes";
import { PeopleSliceTypes } from "~community/people/types/SliceTypes";

const defaultEmployee: EmployeeType = {
  personal: {
    general: {
      firstName: null,
      middleName: null,
      lastName: null,
      gender: null,
      dateOfBirth: null,
      nationality: null,
      nin: null,
      passportNumber: null,
      maritalStatus: null
    },
    contact: {
      personalEmail: null,
      countryCode: null,
      phone: null,
      addressLine1: null,
      addressLine2: null,
      city: null,
      country: null,
      state: null,
      postalCode: null
    },
    family: [],
    educational: [],
    socialMedia: {
      linkedin: null,
      facebook: null,
      instagram: null,
      x: null
    },
    healthAndOther: {
      bloodGroup: null,
      allergies: null,
      dietaryRestrictions: null,
      tshirtSize: null
    }
  },
  emergency: {
    primaryEmergencyContact: {
      name: null,
      relationship: null,
      countryCode: null,
      contactNumber: null
    },
    secondaryEmergencyContact: {
      name: null,
      relationship: null,
      countryCode: null,
      contactNumber: null
    }
  },
  employment: {
    employmentDetails: {
      employeeNo: null,
      workEmail: null,
      employmentAllocation: null,
      teams: null,
      primarySupervisor: null,
      secondarySupervisor: null,
      joinedDate: null,
      probationStartDate: null,
      probationEndDate: null,
      workTimeZone: null
    },
    careerProgression: [],
    identificationAndDiversityDetails: {
      ssn: null,
      ethnicity: null,
      eeoJobCategory: null
    },
    previousEmployment: [],
    visaDetails: []
  },
  systemPermissions: {
    isSuperAdmin: false,
    peopleRole: null,
    leaveRole: null,
    attendanceRole: null,
    eSignRole: null
  },
  common: {
    authPic: null
  }
};

const peopleSlice = (set: SetType<PeopleSliceTypes>): PeopleSliceTypes => ({
  employee: defaultEmployee,
  initialEmployee: defaultEmployee,
  setEmployee: (employee) =>
    set(() => ({ employee, initialEmployee: employee })),
  setPersonalDetails: (personal: PersonalDetailsType) =>
    set((state: PeopleSliceTypes) => ({
      ...state,
      employee: {
        ...state.employee,
        personal: { ...state.employee.personal, ...personal }
      }
    })),
  setEmergencyDetails: (emergency: EmergencyDetailsType) =>
    set((state: PeopleSliceTypes) => ({
      ...state,
      employee: {
        ...state.employee,
        emergency: { ...state.employee.emergency, ...emergency }
      }
    })),
  setEmploymentDetails: (employment: EmploymentFormDetailsType) =>
    set((state: PeopleSliceTypes) => ({
      ...state,
      employee: {
        ...state.employee,
        employment: { ...state.employee.employment, ...employment }
      }
    })),
  setSystemPermissions: (systemPermissions: SystemPermissionsType) =>
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
  setCommonDetails: (common: CommonDetailsType) =>
    set((state: PeopleSliceTypes) => ({
      ...state,
      employee: {
        ...state.employee,
        common: { ...state.employee.common, ...common }
      }
    }))
});

export default peopleSlice;

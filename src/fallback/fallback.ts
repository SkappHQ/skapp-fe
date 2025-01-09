export const firebaseConfig = {};

export const english = {};

export const useFcmToken = () => {
  const token = null;

  const resetUnreadCount = () => {};

  return { token, resetUnreadCount };
};

export const setDeviceToken = (fcmToken: string): void => {};

export const useCheckUserLimit = (isEnterpriseMode: boolean) => {
  return {
    data: false,
    isSuccess: true
  };
};

interface UserLimitStore {
  setShowUserLimitBanner: (value: boolean) => void;
  showUserLimitBanner: boolean;
  setIsUserLimitExceeded: (value: boolean) => void;
}

export const useUserLimitStore = (
  arg0: (state: any) => any
): UserLimitStore => {
  return {
    setShowUserLimitBanner: () => {},
    showUserLimitBanner: false,
    setIsUserLimitExceeded: () => {}
  };
};

export const useGetEnvironment = () => {
  const env = process.env.NEXT_PUBLIC_MODE;

  return env;
};

export const useS3Download = () => {
  const s3FileUrls: Record<string, string> = {};
  const downloadS3File = (key: string) => {};

  return { s3FileUrls, downloadS3File };
};

export const useCheckLoginMethod = (
  onSuccess: (response: any) => void,
  onError?: (error: unknown) => void
) => {
  return {
    mutate: async (data: any) => {}
  };
};

export const useGetGlobalLoginMethod = (
  isEnterpriseMode: boolean,
  tenantName: string
) => {
  return {
    data: {}
  };
};

export interface EmployeeRoleLimit {
  leaveAdminLimitExceeded: boolean;
  attendanceAdminLimitExceeded: boolean;
  peopleAdminLimitExceeded: boolean;
  leaveManagerLimitExceeded: boolean;
  attendanceManagerLimitExceeded: boolean;
  peopleManagerLimitExceeded: boolean;
  superAdminLimitExceeded: boolean;
}

export const useGetEmployeeRoleLimit = (
  onSuccess: (response: EmployeeRoleLimit) => void,
  onError: (error: unknown) => void
) => {
  return {
    mutate: async () => {}
  };
};

export enum FileUrlTypes {
  PROFILE_PICTURE_ATTACHMENTS = "",
  LEAVE_REQUEST_ATTACHMENTS = "",
  ORGANIZATION_LOGO_ATTACHMENTS = ""
}

export interface RequestBody {
  name: string;
  type?: string;
  fileCategory: FileCategories;
  action?: S3ActionTypes;
  tenantId: string;
  folderPath?: string;
}

export enum S3ActionTypes {
  UPLOAD = "",
  DOWNLOAD = ""
}

export enum S3SignedUrlActions {
  PUT_OBJECT = "",
  GET_OBJECT = ""
}

export enum FileCategories {
  LEAVE_REQUEST = "",
  ORGANIZATION_LOGO = "",
  PROFILE_PICTURES = ""
}

const getSubDomain = (url: string, multipleValues: boolean = false) => {};

export const tenantID =
  typeof window !== "undefined"
    ? getSubDomain(window.location.hostname)
    : "skapp-common";

export const uploadFileToS3ByUrl = async (
  file: File,
  fileCategory: FileCategories,
  setFileUploadProgress?: (value: number) => void
) => {
  const filePath = "";
  return filePath;
};

export const deleteFileFromS3 = async (filePath: string) => {};

export const getS3FoldersByUrl = (filePath: string) => {};

export const isProdMaintenanceMode = "";
export const isNonProdMaintenanceMode = "";

export const initializeHotjar = () => {};

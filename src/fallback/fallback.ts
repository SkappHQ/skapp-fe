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

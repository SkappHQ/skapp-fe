/**
 * Placeholder needed for enterprise setups where the path is dynamically
 * switched at build time based on the NEXT_PUBLIC_MODE environment variable.
 * Ensures compatibility during the build process.
 */

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

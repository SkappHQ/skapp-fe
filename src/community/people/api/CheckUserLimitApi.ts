/**
 * Placeholder needed for enterprise setups where the path is dynamically
 * switched at build time based on the NEXT_PUBLIC_MODE environment variable.
 * Ensures compatibility during the build process.
 */

export const useCheckUserLimit = (isEnterpriseMode: boolean) => {
  return {
    data: false,
    isSuccess: true
  };
};

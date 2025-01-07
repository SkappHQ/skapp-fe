/**
 * Placeholder needed for enterprise setups where the path is dynamically
 * switched at build time based on the NEXT_PUBLIC_MODE environment variable.
 * Ensures compatibility during the build process.
 */

export const useCheckLoginMethod = (
  onSuccess: (response: any) => void,
  onError?: (error: unknown) => void
) => {
  return {
    mutate: async (data: any) => {}
  };
};

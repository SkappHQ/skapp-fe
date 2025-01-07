/**
 * Placeholder needed for enterprise setups where the path is dynamically
 * switched at build time based on the NEXT_PUBLIC_MODE environment variable.
 * Ensures compatibility during the build process.
 */
import { FileCategories } from "../types/s3Types";

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

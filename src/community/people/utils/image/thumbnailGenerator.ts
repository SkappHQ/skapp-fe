import { ModifiedFileType } from "~community/people/types/AddNewResourceTypes";

/**
 * This function takes a file object and generates a compressed thumbnail for it.
 * It preserves the original image dimensions but reduces file size by using JPEG compression.
 * @param file the file object to generate the thumbnail for
 * @returns a promise that resolves to an array of ModifiedFileType objects
 */
const generateThumbnail = (
  file: ModifiedFileType
): Promise<ModifiedFileType[]> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = file.preview;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type
            });

            const thumbnailWithPreview = Object.assign(compressedFile, {
              preview: URL.createObjectURL(compressedFile),
              path: file.path
            });

            resolve([thumbnailWithPreview]);
          } else {
            reject(new Error("Failed to create thumbnail blob."));
          }
        },
        file.type,
        0.5
      );
    };
    img.onerror = reject;
  });
};

export default generateThumbnail;

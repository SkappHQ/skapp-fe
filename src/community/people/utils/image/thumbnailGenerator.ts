import { ModifiedFileType } from "~community/people/types/AddNewResourceTypes";

/**
 * This function takes a file object and generates a 128x128px square thumbnail for it,
 * scaling the smaller dimension to 128px and cropping the larger dimension from the center.
 * The thumbnail is returned as an array of ModifiedFileType objects.
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
      const targetSize = 128;
      const aspectRatio = img.width / img.height;

      let scaledWidth = img.width;
      let scaledHeight = img.height;
      let offsetX = 0;
      let offsetY = 0;

      if (img.width > img.height) {
        scaledHeight = targetSize;
        scaledWidth = targetSize * aspectRatio;
        offsetX = (scaledWidth - targetSize) / 2;
      } else {
        scaledWidth = targetSize;
        scaledHeight = targetSize / aspectRatio;
        offsetY = (scaledHeight - targetSize) / 2;
      }

      canvas.width = targetSize;
      canvas.height = targetSize;

      ctx?.drawImage(
        img,
        offsetX,
        offsetY,
        scaledWidth,
        scaledHeight,
        0,
        0,
        targetSize,
        targetSize
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const thumbnailFile = new File([blob], file.name, {
            type: file.type
          });

          const thumbnailWithPreview = Object.assign(thumbnailFile, {
            preview: URL.createObjectURL(thumbnailFile),
            path: file.path
          });

          resolve([thumbnailWithPreview]);
        } else {
          reject(new Error("Failed to create thumbnail blob."));
        }
      }, file.type);
    };
    img.onerror = reject;
  });
};

export default generateThumbnail;

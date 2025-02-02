import { ModifiedFileType } from "~community/people/types/AddNewResourceTypes";

const generateThumbnail = (
  file: ModifiedFileType
): Promise<ModifiedFileType[]> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = file.preview;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const targetSize = 100;
      const aspectRatio = img.width / img.height;

      let width, height;

      if (img.width > img.height) {
        width = targetSize;
        height = targetSize / aspectRatio;
      } else {
        height = targetSize;
        width = targetSize * aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

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

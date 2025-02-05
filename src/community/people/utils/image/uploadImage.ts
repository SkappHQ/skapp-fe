import { appModes } from "~community/common/constants/configs";
import { ErrorResponse } from "~community/common/types/CommonTypes";
import { ModifiedFileType } from "~community/people/types/AddNewResourceTypes";
import { FileCategories } from "~enterprise/common/types/s3Types";
import { uploadFileToS3ByUrl } from "~enterprise/common/utils/awsS3ServiceFunctions";

interface UploadImageProps {
  environment: string | undefined;
  authPic: [] | ModifiedFileType[] | string | null | undefined;
  thumbnail: [] | ModifiedFileType[] | string | null | undefined;
  imageUploadMutate: any;
}

const uploadImage = async ({
  environment,
  authPic,
  thumbnail,
  imageUploadMutate
}: UploadImageProps) => {
  let newAuthPicURL = "";

  if (environment === appModes.COMMUNITY) {
    const formData = new FormData();
    if (authPic && authPic.length > 0) {
      formData.append("file", authPic[0]);
    }

    formData.append("type", "USER_IMAGE");

    await imageUploadMutate(formData).then((response: ErrorResponse) => {
      const filePath = response.message?.split(
        "File uploaded successfully: "
      )[1];
      if (filePath) {
        const fileName = filePath.split("/").pop();
        if (fileName) {
          newAuthPicURL = fileName;
        }
      }
    });
  } else {
    await uploadFileToS3ByUrl(
      (authPic as ModifiedFileType[])[0],
      FileCategories.PROFILE_PICTURES_ORIGINAL
    );

    if (typeof thumbnail === "object" && thumbnail && thumbnail?.length > 0) {
      const thumbnailURL = await uploadFileToS3ByUrl(
        thumbnail[0],
        FileCategories.PROFILE_PICTURES_THUMBNAIL
      );

      newAuthPicURL = thumbnailURL.split("/").slice(2).join("/");
    }
  }

  return newAuthPicURL;
};

export default uploadImage;

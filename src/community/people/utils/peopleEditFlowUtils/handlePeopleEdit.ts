import { useRouter } from "next/router";

import { useUploadImages } from "~community/common/api/FileHandleApi";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { useEditEmployee } from "~community/people/api/PeopleApi";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import { usePeopleStore } from "~community/people/store/store";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";

import { handleError } from "../directoryUtils/addNewResourceFlowUtils/addNewResourceUtils";
import uploadImage from "../image/uploadImage";

export const handlePeopleEdit = async () => {
  const { profilePic, thumbnail, setCommonDetails } = usePeopleStore(
    (state) => state
  );

  const environment = useGetEnvironment();

  const { apiPayload } = useFormChangeDetector();

  const router = useRouter();

  const { id } = router.query;

  const { setToastMessage } = useToast();

  const { mutate } = useEditEmployee(id as string);

  const { mutateAsync: handleUploadImagesAsync } = useUploadImages();

  const translateError = useTranslator("peopleModule", "addResource");

  if (profilePic !== null) {
    const newAuthPicURL = await uploadImage({
      environment,
      authPic: profilePic,
      thumbnail: thumbnail,
      imageUploadMutate: handleUploadImagesAsync,
      onError: () =>
        handleError({
          message: translateError(["uploadError"]),
          setToastMessage,
          translateError
        })
    });

    setCommonDetails({
      authPic: newAuthPicURL ?? ""
    });
    mutate({
      ...apiPayload,
      common: { authPic: newAuthPicURL }
    });
  } else {
    mutate(apiPayload);
  }
};

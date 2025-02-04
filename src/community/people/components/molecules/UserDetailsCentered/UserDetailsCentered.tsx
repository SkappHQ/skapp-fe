import { Box, type SxProps, Typography } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useGetUploadedImage } from "~community/common/api/FileHandleApi";
import Avatar from "~community/common/components/molecules/Avatar/Avatar";
import { appModes } from "~community/common/constants/configs";
import { accountPageTestId } from "~community/common/constants/testIds";
import { FileTypes } from "~community/common/enums/CommonEnums";
import { theme } from "~community/common/theme/theme";
import { usePeopleStore } from "~community/people/store/store";
import { ModifiedFileType } from "~community/people/types/AddNewResourceTypes";
import { EmployeeDetails } from "~community/people/types/EmployeeTypes";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";

interface Props {
  selectedUser: EmployeeDetails;
  styles?: SxProps;
  isLoading?: boolean;
  isSuccess?: boolean;
  enableEdit?: boolean;
}

const UserDetailsCentered: FC<Props> = ({
  selectedUser,
  styles,
  enableEdit = false
}) => {
  const [profilePicture, setProfilePicture] = useState<string>();
  const { employeeGeneralDetails, setEmployeeGeneralDetails } = usePeopleStore(
    (state) => state
  );

  const environment = useGetEnvironment();
  const cardData = useMemo(() => {
    return {
      employeeId: selectedUser?.identificationNo?.toString() || "",
      authPic: selectedUser?.authPic || "",
      firstName: selectedUser?.firstName ?? "",
      lastName: selectedUser?.lastName || "",
      fullName:
        selectedUser?.firstName?.concat(" ", selectedUser?.lastName ?? "") ||
        "",
      jobFamily: selectedUser?.jobFamily?.name || "",
      jobTitle: selectedUser?.jobTitle?.name || ""
    };
  }, [selectedUser]);

  const onDrop: (acceptedFiles: File[]) => void = useCallback(
    (acceptedFiles: File[]) => {
      const profilePic = acceptedFiles.map((file: File) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setEmployeeGeneralDetails("authPic", profilePic as ModifiedFileType[]);
    },
    [setEmployeeGeneralDetails]
  );

  const { open, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      "image/svg+xml": [],
      "image/png": [],
      "image/jpg": [],
      "image/jpeg": []
    }
  });

  const { data: uploadedImage, isLoading } = useGetUploadedImage(
    FileTypes.USER_IMAGE,
    cardData?.authPic,
    true,
    environment !== appModes.ENTERPRISE
  );

  const handleUnSelectPhoto = (): void => {
    setEmployeeGeneralDetails("authPic", profilePicture);
    setProfilePicture("");
  };

  useEffect(() => {
    if (!isLoading && uploadedImage) {
      setProfilePicture(uploadedImage);
    }
  }, [isLoading, uploadedImage]);

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...styles
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <Avatar
          id="avatar"
          firstName={cardData?.firstName}
          lastName={cardData?.lastName}
          alt={cardData?.fullName}
          src={
            (employeeGeneralDetails?.authPic as string) ||
            (profilePicture ?? "")
          }
          avatarStyles={{
            width: "6.125rem",
            height: "6.125rem",
            border: "none"
          }}
          getInputProps={getInputProps}
          handleUnSelectPhoto={handleUnSelectPhoto}
          open={open}
          enableEdit={enableEdit}
          imageUploaded={
            cardData?.authPic !==
            ((employeeGeneralDetails?.authPic as string) ?? "")
          }
          data-testid={accountPageTestId.UserDetailsCentered.profileAvatar}
        />
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "0.5rem",
            textAlign: "center"
          }}
        >
          <Typography
            variant="body1"
            component="h3"
            sx={{
              fontWeight: 700,
              lineHeight: "1.875rem",
              fontSize: "1.25rem"
            }}
          >
            {cardData?.fullName}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              lineHeight: "1.5rem",
              fontSize: "1rem",
              color: theme.palette.text.secondary
            }}
          >
            {cardData?.jobTitle} {cardData?.jobFamily}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetailsCentered;

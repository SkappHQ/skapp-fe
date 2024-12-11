import {
  Box,
  Avatar as MuiAvatar,
  type AvatarProps as MuiAvatarProps,
  Stack,
  type SxProps
} from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { type FC, useEffect, useState } from "react";
import { type DropzoneInputProps } from "react-dropzone";

import { useGetUploadedImage } from "~community/common/api/FileHandleApi";
import DefaultAvatar from "~community/common/components/atoms/DefaultAvatar/DefaultAvatar";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { FileTypes } from "~community/common/enums/CommonEnums";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

interface AvatarProps extends MuiAvatarProps {
  firstName: string;
  lastName: string;
  src: string;
  avatarStyles?: SxProps;
  getInputProps?: <T extends DropzoneInputProps>(props?: T) => T;
  handleUnSelectPhoto?: () => void;
  open?: () => void;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  enableEdit?: boolean;
  imageUploaded?: boolean;
  "data-testid"?: string;
}

const Avatar: FC<AvatarProps> = ({
  firstName,
  lastName,
  src,
  avatarStyles,
  children,
  getInputProps,
  handleUnSelectPhoto,
  open,
  onClick,
  onMouseEnter,
  onMouseLeave,
  enableEdit = false,
  imageUploaded = false,
  "data-testid": testId
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);
  const [image, setImage] = useState<string | null>(null);

  const { data: logoUrl } = useGetUploadedImage(
    FileTypes.USER_IMAGE,
    src,
    true
  );

  useEffect(() => {
    if (logoUrl) setImage(logoUrl);
    else if (src) setImage(src);
  }, [logoUrl, src]);

  const renderAvatar = () => {
    if (image) {
      return (
        <MuiAvatar
          src={image}
          sx={avatarStyles}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {children}
        </MuiAvatar>
      );
    }

    return (
      <DefaultAvatar
        firstName={firstName}
        lastName={lastName}
        containerStyles={
          mergeSx([avatarStyles, classes.defaultAvatarContainer]) as SxProps
        }
        typographyStyles={classes.defaultAvatarTypography}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  };

  const handleUnselect = () => {
    handleUnSelectPhoto?.();
    setImage(null);
  };
  const renderEditIcon = () => {
    if (!enableEdit) return null;

    return (
      <Box>
        <input id="imageInput" {...(getInputProps ? getInputProps() : {})} />
        <Box
          sx={classes.iconWrapper}
          onClick={imageUploaded ? handleUnselect : open}
          data-testid={testId}
        >
          <Icon
            name={
              imageUploaded
                ? IconName.REQUEST_CANCEL_CROSS_ICON
                : IconName.EDIT_ICON
            }
            fill={theme.palette.primary.dark}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Stack sx={classes.wrapper}>
      <Stack sx={classes.container}>
        {renderAvatar()}
        {renderEditIcon()}
      </Stack>
    </Stack>
  );
};

export default Avatar;
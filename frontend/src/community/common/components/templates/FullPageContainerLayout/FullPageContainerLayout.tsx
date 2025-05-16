import {
  IconButton,
  Stack,
  SxProps,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { JSX, ReactNode } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import Icon from "../../atoms/Icon/Icon";
import styles from "./styles";

interface Props {
  pageHead: string;
  icon?: {
    name?: IconName;
    dataTestId?: string;
    onClick?: () => void | Promise<void>;
    styles?: SxProps;
  };
  title: string;
  stepText: string;
  customStyles?: {
    wrapper?: SxProps;
    container?: SxProps;
    header?: SxProps;
    title?: SxProps;
    stepText?: SxProps;
    body?: SxProps;
  };
  children?: ReactNode;
}

const FullPageContainerLayout = ({
  pageHead,
  icon,
  title,
  stepText,
  customStyles,
  children
}: Props): JSX.Element => {
  const router = useRouter();

  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateAria = useTranslator("commonAria", "components");

  const onIconClick = () => {
    if (icon?.onClick) {
      icon.onClick();
    } else {
      router.back();
    }
  };

  return (
    <>
      <Head>
        <title>{pageHead}</title>
      </Head>
      <Stack sx={mergeSx([classes.wrapper, customStyles?.wrapper])}>
        <Stack sx={mergeSx([classes.container, customStyles?.container])}>
          <Stack sx={mergeSx([classes.header, customStyles?.header])}>
            <IconButton
              tabIndex={0}
              data-testid={icon?.dataTestId}
              aria-label={translateAria(["backButton"])}
              title={translateAria(["backButton"])}
              onClick={onIconClick}
              sx={classes.iconBtn}
            >
              <Icon name={icon?.name ?? IconName.CLOSE_ICON} />
            </IconButton>
            <Stack sx={mergeSx([classes.title, customStyles?.title])}>
              <Typography variant="h1">{title}</Typography>
              <Typography
                variant="body2"
                sx={mergeSx([classes.stepText, customStyles?.stepText])}
              >
                {stepText}
              </Typography>
            </Stack>
          </Stack>
          <Stack sx={mergeSx([customStyles?.body])}>{children}</Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default FullPageContainerLayout;

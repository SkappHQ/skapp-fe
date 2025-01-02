import { Box, Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { type SxProps } from "@mui/system";
import { FC, JSX, ReactNode } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

interface Props {
  title?: string;
  description?: string;
  addNewEmployeeAction?: boolean;
  children?: ReactNode;
  spacing?: string;
  titleStyles?: SxProps;
  descriptionStyles?: SxProps;
  isIconTitleInline?: boolean;
  buttonText?: string | boolean;
  buttonEndIcon?: JSX.Element;
  buttonStartIcon?: JSX.Element;
  onButtonClick?: () => void;
  buttonStyle?: ButtonStyle;
  wrapperStyles?: SxProps;
}
const TableEmptyScreen: FC<Props> = ({
  title,
  description,
  spacing = "1rem",
  titleStyles,
  descriptionStyles,
  isIconTitleInline,
  buttonText = "",
  buttonStartIcon,
  onButtonClick,
  buttonStyle = ButtonStyle.PRIMARY,
  wrapperStyles
}) => {
  const theme: Theme = useTheme();

  const classes = styles(theme);

  return (
    <Stack sx={{ ...classes.wrapper, ...wrapperStyles }}>
      <Stack
        spacing={spacing}
        sx={classes.container}
        component="div"
        role="status"
      >
        <Box sx={classes.titleWrapper(isIconTitleInline)}>
          <Icon name={IconName.MAGNIFYING_GLASS_ICON} />
          {title && (
            <Typography
              variant="h3"
              sx={mergeSx([classes.title(isIconTitleInline), titleStyles])}
            >
              {title}
            </Typography>
          )}
        </Box>
        <Typography
          component="div"
          variant="body2"
          sx={mergeSx([classes.description, descriptionStyles])}
        >
          {description}
        </Typography>
        {buttonText && (
          <Box sx={classes.btnWrapper}>
            <Button
              label={buttonText as string}
              endIcon={<Icon name={IconName.ADD_ICON} />}
              startIcon={buttonStartIcon}
              buttonStyle={buttonStyle}
              isFullWidth={false}
              onClick={onButtonClick}
              styles={classes.buttonStyles}
            />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default TableEmptyScreen;

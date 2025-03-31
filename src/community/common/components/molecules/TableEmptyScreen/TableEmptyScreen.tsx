import { Stack, Typography } from "@mui/material";
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
  id?: {
    emptyScreen?: {
      button?: string;
    };
  };
  title?: string;
  description?: string;
  addNewEmployeeAction?: boolean;
  children?: ReactNode;
  titleStyles?: SxProps;
  descriptionStyles?: SxProps;
  buttonText?: string | boolean;
  buttonEndIcon?: JSX.Element;
  buttonStartIcon?: JSX.Element;
  onButtonClick?: () => void;
  buttonStyle?: ButtonStyle;
  wrapperStyles?: SxProps;
  shouldEmptyTableScreenBtnBlink?: boolean;
}
const TableEmptyScreen: FC<Props> = ({
  id,
  title,
  description,
  titleStyles,
  descriptionStyles,
  buttonText = "",
  buttonStartIcon,
  onButtonClick,
  buttonStyle = ButtonStyle.PRIMARY,
  wrapperStyles,
  shouldEmptyTableScreenBtnBlink
}) => {
  const theme: Theme = useTheme();

  const classes = styles(theme);

  return (
    <Stack sx={mergeSx([classes.wrapper, wrapperStyles])}>
      <Stack component="div" role="output" sx={classes.container}>
        <Icon name={IconName.MAGNIFYING_GLASS_ICON} />
        {title && (
          <Typography variant="h3" sx={mergeSx([classes.title, titleStyles])}>
            {title}
          </Typography>
        )}
        <Typography
          component="div"
          variant="body2"
          sx={mergeSx([classes.description, descriptionStyles])}
        >
          {description}
        </Typography>
        {buttonText && (
          <Button
            id={id?.emptyScreen?.button}
            shouldBlink={shouldEmptyTableScreenBtnBlink}
            label={buttonText as string}
            endIcon={<Icon name={IconName.ADD_ICON} />}
            startIcon={buttonStartIcon}
            buttonStyle={buttonStyle}
            isFullWidth={false}
            onClick={onButtonClick}
            styles={classes.buttonStyles}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default TableEmptyScreen;

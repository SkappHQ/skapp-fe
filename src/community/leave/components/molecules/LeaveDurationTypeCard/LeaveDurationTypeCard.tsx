import { Stack, type SxProps, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { JSX, type MouseEventHandler, useMemo } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import { styles } from "./styles";

interface Props {
  title: string;
  description: string;
  cardStyles?: SxProps;
  selected: boolean;
  isError?: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const LeaveDurationTypeCard = ({
  title,
  description,
  cardStyles,
  selected,
  isError,
  onClick
}: Props): JSX.Element => {
  const theme: Theme = useTheme();

  const classes = styles(theme);

  const icon = useMemo(() => {
    if (selected) {
      return <Icon name={IconName.SUCCESS_ICON} />;
    } else if (isError) {
      return <Icon name={IconName.UNCHECKED_ICON} />;
    } else {
      return (
        <Icon name={IconName.UNCHECKED_ICON} fill={theme.palette.grey[500]} />
      );
    }
  }, [selected, isError, theme.palette.grey]);

  return (
    <Stack
      sx={mergeSx([
        classes.wrapper,
        {
          ...(selected && {
            borderColor: theme.palette.secondary.dark,
            background: theme.palette.secondary.main
          }),
          ...(isError && {
            borderColor: theme.palette.error.contrastText,
            background: theme.palette.error.light
          })
        },
        cardStyles
      ])}
      onClick={onClick}
    >
      <Stack sx={classes.iconWrapper}>{icon}</Stack>
      <Stack sx={classes.contentWrapper}>
        <Typography
          variant="h4"
          sx={{
            color: isError
              ? theme.palette.error.contrastText
              : theme.palette.common.black
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isError
              ? theme.palette.error.contrastText
              : theme.palette.common.black
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default LeaveDurationTypeCard;

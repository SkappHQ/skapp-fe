import {
  Stack,
  type SxProps,
  Typography,
  TypographyProps
} from "@mui/material";
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
  cardWrapperStyles?: SxProps;
  selected: boolean;
  isError?: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  typographyStyles: {
    variant: {
      title: TypographyProps["variant"];
      description: TypographyProps["variant"];
    };
    color: {
      title: string;
      description: string;
    };
  };
  isChevronIconVisible?: boolean;
  isAnimationOn?: boolean;
}

const DescribedSelection = ({
  title,
  description,
  cardStyles,
  cardWrapperStyles,
  selected,
  isError,
  onClick,
  typographyStyles,
  isChevronIconVisible = false,
  isAnimationOn = true
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

  const opacityAnimation = () => {
    return isAnimationOn
      ? {
          animation: "opacity-blink 1.5s ease-in-out infinite",
          "@keyframes opacity-blink": {
            "0%, 49%": {
              color: theme.palette.text.secondary
            },
            "50%, 99%": {
              color: theme.palette.text.textDarkGrey
            },
            "100%": {
              color: theme.palette.common.black
            }
          }
        }
      : {};
  };

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
        cardWrapperStyles
      ])}
      onClick={onClick}
    >
      <Stack sx={mergeSx([classes.container, cardStyles])}>
        <Stack sx={classes.iconWrapper}>{icon}</Stack>
        <Stack sx={classes.contentWrapper}>
          <Stack sx={classes.textWrapper}>
            <Typography
              variant={typographyStyles?.variant?.title}
              sx={{
                color: isError
                  ? theme.palette.error.contrastText
                  : typographyStyles?.color?.title,
                ...opacityAnimation()
              }}
            >
              {title}
            </Typography>
            <Typography
              variant={typographyStyles?.variant?.description}
              sx={{
                color: isError
                  ? theme.palette.error.contrastText
                  : typographyStyles?.color?.description,
                ...opacityAnimation()
              }}
            >
              {description}
            </Typography>
          </Stack>
          {isChevronIconVisible && (
            <Stack sx={classes.iconWrapper}>
              <Icon name={IconName.CHEVRON_RIGHT_ICON} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DescribedSelection;

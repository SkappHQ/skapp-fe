import {
  Divider,
  IconButton,
  Stack,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import { type SxProps } from "@mui/system";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { JSX, memo } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { contentLayoutTestId } from "~community/common/constants/testIds";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import {
  MediaQueries,
  useMediaQuery
} from "~community/common/hooks/useMediaQuery";
import { useVersionUpgradeStore } from "~community/common/stores/versionUpgradeStore";
import { AdminTypes } from "~community/common/types/AuthTypes";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import VersionUpgradeBanner from "../../molecules/VersionUpgradeBanner/VersionUpgradeBanner";
import styles from "./styles";

interface Props {
  pageHead: string;
  title: string;
  containerStyles?: SxProps;
  dividerStyles?: SxProps;
  children: JSX.Element;
  secondaryBtnText?: string;
  primaryButtonText?: string | boolean;
  primaryBtnIconName?: IconName;
  secondaryBtnIconName?: IconName;
  isBackButtonVisible?: boolean;
  isDividerVisible?: boolean;
  primaryButtonType?: ButtonStyle;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  subtitleNextToTitle?: string;
  onBackClick?: () => void;
  customRightContent?: JSX.Element;
  isTitleHidden?: boolean;
  isPrimaryBtnLoading?: boolean;
}

const ContentLayout = ({
  pageHead,
  title,
  containerStyles,
  children,
  primaryButtonText,
  secondaryBtnText,
  primaryButtonType,
  primaryBtnIconName = IconName.ADD_ICON,
  secondaryBtnIconName = IconName.ADD_ICON,
  isBackButtonVisible = false,
  isDividerVisible = true,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  subtitleNextToTitle,
  onBackClick,
  dividerStyles,
  customRightContent,
  isTitleHidden = false,
  isPrimaryBtnLoading = false
}: Props): JSX.Element => {
  const theme: Theme = useTheme();

  const isBelow600 = useMediaQuery()(MediaQueries.BELOW_600);

  const classes = styles(theme);

  const router = useRouter();

  const { data } = useSession();

  const { showInfoBanner, isDailyNotifyDisplayed } = useVersionUpgradeStore(
    (state) => state
  );
  return (
    <>
      <Head>
        <title>{pageHead}</title>
      </Head>
      <Stack sx={mergeSx([classes.container, containerStyles])}>
        {showInfoBanner &&
          !isDailyNotifyDisplayed &&
          data?.user.roles?.includes(AdminTypes.SUPER_ADMIN) && (
            <VersionUpgradeBanner />
          )}
        <Stack sx={classes.header}>
          <Stack sx={classes.leftContent}>
            {isBackButtonVisible && (
              <IconButton
                sx={classes.leftArrowIconBtn}
                onClick={
                  onBackClick ||
                  (() => {
                    router.back();
                  })
                }
                data-testid={contentLayoutTestId.buttons.backButton}
              >
                <Icon name={IconName.LEFT_ARROW_ICON} />
              </IconButton>
            )}
            {!isTitleHidden && <Typography variant="h1">{title}</Typography>}

            {subtitleNextToTitle && (
              <Typography
                variant="body2"
                component="h3"
                sx={{
                  color: theme.palette.primary.dark
                }}
              >
                {subtitleNextToTitle}
              </Typography>
            )}
          </Stack>
          <Stack sx={classes.rightContent}>
            {secondaryBtnText && (
              <Button
                isFullWidth={isBelow600}
                buttonStyle={ButtonStyle.SECONDARY}
                size={ButtonSizes.MEDIUM}
                label={secondaryBtnText}
                endIcon={secondaryBtnIconName}
                onClick={onSecondaryButtonClick}
                dataTestId={contentLayoutTestId.buttons.secondaryButton}
              />
            )}
            {primaryButtonText && (
              <Button
                isFullWidth={isBelow600}
                buttonStyle={primaryButtonType ?? ButtonStyle.PRIMARY}
                label={primaryButtonText as string}
                size={ButtonSizes.MEDIUM}
                endIcon={primaryBtnIconName}
                isLoading={isPrimaryBtnLoading}
                onClick={onPrimaryButtonClick}
                data-testid={contentLayoutTestId.buttons.primaryButton}
              />
            )}
            {customRightContent}
          </Stack>
        </Stack>

        {isDividerVisible && (
          <Stack sx={mergeSx([classes.dividerWrapper, dividerStyles])}>
            <Divider />
          </Stack>
        )}
        {children}
      </Stack>
    </>
  );
};

export default memo(ContentLayout);

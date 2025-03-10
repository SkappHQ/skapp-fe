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
import { JSX, memo, useEffect, useMemo } from "react";

import { useGetOrganization } from "~community/common/api/OrganizationCreateApi";
import { useStorageAvailability } from "~community/common/api/StorageAvailabilityApi";
import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import VersionUpgradeBanner from "~community/common/components/molecules/VersionUpgradeBanner/VersionUpgradeBanner";
import { appModes } from "~community/common/constants/configs";
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
import { themeSelector } from "~community/common/theme/themeSelector";
import { AdminTypes } from "~community/common/types/AuthTypes";
import { ThemeTypes } from "~community/common/types/AvailableThemeColors";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";
import { EIGHTY_PERCENT } from "~community/common/utils/getConstants";
import QuickSetupContainer from "~enterprise/common/components/molecules/QuickSetupContainer/QuickSetupContainer";
import SubscriptionEndedModalController from "~enterprise/common/components/molecules/SubscriptionEndedModalController/SubscriptionEndedModalController";
import {
  SubscriptionModalTypeEnums,
  TierEnum
} from "~enterprise/common/enums/Common";
import { useCommonEnterpriseStore } from "~enterprise/common/store/commonStore";
import { useCheckUserLimit } from "~enterprise/people/api/CheckUserLimitApi";
import UserLimitBanner from "~enterprise/people/components/molecules/UserLimitBanner/UserLimitBanner";
import { useUserLimitStore } from "~enterprise/people/store/userLimitStore";

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
  backIcon?: IconName;
  isPrimaryBtnDisabled?: boolean;
  id?: {
    btnWrapper?: string;
    primaryBtn?: string;
    secondaryBtn?: string;
  };
  shouldBlink?: {
    primaryBtn?: boolean;
    secondaryBtn?: boolean;
  };
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
  isPrimaryBtnLoading = false,
  backIcon = IconName.LEFT_ARROW_ICON,
  isPrimaryBtnDisabled = false,
  id,
  shouldBlink
}: Props): JSX.Element => {
  const theme: Theme = useTheme();
  const isEnterpriseMode = process.env.NEXT_PUBLIC_MODE === "enterprise";
  const isBelow600 = useMediaQuery()(MediaQueries.BELOW_600);

  const classes = styles(theme);

  const router = useRouter();

  const { data } = useSession();

  const { asPath } = useRouter();

  const { showInfoBanner, isDailyNotifyDisplayed } = useVersionUpgradeStore(
    (state) => state
  );

  const { setIsSubscriptionEndedModalOpen, setSubscriptionEndedModalType } =
    useCommonEnterpriseStore((state) => state);

  useEffect(() => {
    if (data?.user?.tier === TierEnum.PRO) {
      setSubscriptionEndedModalType(
        SubscriptionModalTypeEnums.SUBSCRIPTION_CANCELLED_MODAL
      );
      setIsSubscriptionEndedModalOpen(true);
    }

    if (asPath === "/remove-people" || asPath === "/change-supervisors") {
      setIsSubscriptionEndedModalOpen(false);
    }
  }, [
    asPath,
    data?.user?.tier,
    setIsSubscriptionEndedModalOpen,
    setSubscriptionEndedModalType
  ]);

  const { data: organizationDetails } = useGetOrganization();

  const updatedTheme = themeSelector(
    organizationDetails?.results?.[0]?.themeColor || ThemeTypes.BLUE_THEME
  );

  theme.palette = updatedTheme.palette;

  const {
    setShowUserLimitBanner,
    showUserLimitBanner,
    setIsUserLimitExceeded
  } = useUserLimitStore((state) => state);

  const { data: storageAvailabilityData } = useStorageAvailability();

  const usedStoragePercentage = useMemo(() => {
    return 100 - storageAvailabilityData?.availableSpace;
  }, [storageAvailabilityData]);

  const { data: checkUserLimit, isSuccess: isCheckUserLimitSuccess } =
    useCheckUserLimit(isEnterpriseMode);

  useEffect(() => {
    if (isEnterpriseMode) {
      if (isCheckUserLimitSuccess && checkUserLimit === true) {
        setIsUserLimitExceeded(true);
        setShowUserLimitBanner(true);
      }
    }
  }, [
    isEnterpriseMode,
    isCheckUserLimitSuccess,
    checkUserLimit,
    setIsUserLimitExceeded,
    setShowUserLimitBanner
  ]);

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
        {process.env.NEXT_PUBLIC_MODE === appModes.COMMUNITY &&
          data?.user.roles?.includes(AdminTypes.SUPER_ADMIN) &&
          usedStoragePercentage !== undefined &&
          usedStoragePercentage !== null &&
          usedStoragePercentage >= EIGHTY_PERCENT && (
            <VersionUpgradeBanner
              isStorageBanner
              usedSpace={usedStoragePercentage}
            />
          )}

        {showUserLimitBanner &&
          (data?.user.roles?.includes(AdminTypes.SUPER_ADMIN) ||
            data?.user.roles?.includes(AdminTypes.PEOPLE_ADMIN)) && (
            <UserLimitBanner />
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
                <Icon name={backIcon} />
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
          <Stack sx={classes.rightContent} id={id?.btnWrapper}>
            {secondaryBtnText && (
              <Button
                isFullWidth={isBelow600}
                buttonStyle={ButtonStyle.SECONDARY}
                size={ButtonSizes.MEDIUM}
                label={secondaryBtnText}
                endIcon={secondaryBtnIconName}
                onClick={onSecondaryButtonClick}
                dataTestId={contentLayoutTestId.buttons.secondaryButton}
                shouldBlink={shouldBlink?.secondaryBtn}
                id={id?.secondaryBtn}
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
                shouldBlink={shouldBlink?.primaryBtn}
                id={id?.primaryBtn}
                disabled={isPrimaryBtnDisabled}
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
        <QuickSetupContainer />
        <SubscriptionEndedModalController />
      </Stack>
    </>
  );
};

export default memo(ContentLayout);

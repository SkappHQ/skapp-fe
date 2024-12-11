import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { AppVersionNotificationType } from "~community/common/enums/CommonEnums";
import { ButtonSizes } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useVersionUpgradeStore } from "~community/common/stores/versionUpgradeStore";
import { theme } from "~community/common/theme/theme";
import { IconName } from "~community/common/types/IconTypes";
import {
  EIGHTY_PERCENT,
  NINETY_PERCENT
} from "~community/common/utils/getConstants";

import Button from "../../atoms/Button/Button";
import Icon from "../../atoms/Icon/Icon";

interface Props {
  isStorageBanner?: boolean;
  usedSpace?: number;
}
const VersionUpgradeBanner = ({
  isStorageBanner = false,
  usedSpace
}: Props) => {
  const { pathname } = useRouter();
  const {
    setIsDailyNotifyDisplayed,
    setShowInfoBanner,
    versionUpgradeInfo,
    clearVersionUpgradeInfo
  } = useVersionUpgradeStore((state) => state);
  const translateText = useTranslator("storageAvailability");
  const handleClose = () => {
    setIsDailyNotifyDisplayed(false);
    setShowInfoBanner(false);
    clearVersionUpgradeInfo();
  };

  const handleButtonClick = () => {
    window.open(versionUpgradeInfo?.redirectUrl, "_blank");
  };
  const getBannerMessage = (isStorageBanner: boolean, usedSpace?: number) => {
    if (isStorageBanner && usedSpace) {
      if (usedSpace >= NINETY_PERCENT) {
        return (
          <>
            <Typography
              variant="body1"
              component="span"
              sx={{ fontWeight: "bold", color: theme.palette.text.darkerText }}
            >
              {translateText(["storageUsageReached"])}
            </Typography>{" "}
            <Typography
              variant="body1"
              component="span"
              sx={{ color: theme.palette.text.darkerText }}
            >
              {translateText(["increaseStorageText"])}
            </Typography>
          </>
        );
      }

      if (usedSpace >= EIGHTY_PERCENT) {
        return (
          <>
            <Typography
              variant="body1"
              component="span"
              sx={{ fontWeight: "bold", color: theme.palette.text.darkerText }}
            >
              {translateText(["availableSpaceText"], {
                availableSpace: usedSpace
              })}
            </Typography>{" "}
            <Typography
              variant="body1"
              component="span"
              sx={{ color: theme.palette.text.darkerText }}
            >
              {translateText(["considerText"])}
            </Typography>
          </>
        );
      }
    }
  };

  return (
    <Stack
      sx={{
        padding: "0.5rem 2.375rem",
        backgroundColor: isStorageBanner
          ? theme.palette.error.light
          : versionUpgradeInfo?.type === AppVersionNotificationType.CRITICAL
            ? "#7F1D1D"
            : "#2A61A0",
        borderRadius: "0.5rem",
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: "1.5rem",
        alignItems: "center",
        display: pathname.includes("dashboard") ? "flex" : "none",
        height: isStorageBanner ? "60px" : "auto"
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          gap: "0.75rem"
        }}
      >
        <Icon
          name={
            isStorageBanner
              ? IconName.WARNING_SIGN_ICON
              : IconName.UPGRADE_INFO_ICON
          }
        />
        <Typography
          variant="body1"
          sx={{
            color: isStorageBanner ? theme.palette.text.darkerText : "#FFFFFF"
          }}
        >
          {isStorageBanner
            ? getBannerMessage(isStorageBanner, usedSpace)
            : versionUpgradeInfo?.bannerDescription}
        </Typography>
      </Stack>
      <Stack
        sx={{
          flexDirection: "row",
          gap: 3
        }}
      >
        {!isStorageBanner && versionUpgradeInfo?.buttonText && (
          <Button
            label={versionUpgradeInfo?.buttonText}
            styles={{
              padding: { xs: "0.325rem 0.625rem", sm: "0.625rem 1rem" },
              backgroundColor: "#FFFFFF",
              ".MuiTypography-root": {
                color:
                  versionUpgradeInfo?.type ===
                  AppVersionNotificationType.CRITICAL
                    ? "#7F1D1D"
                    : "#396996"
              },
              "&:hover": {
                outline: "none",
                border: `0.125rem solid transparent`
              }
            }}
            size={ButtonSizes.SMALL}
            onClick={handleButtonClick}
          />
        )}

        {!isStorageBanner && (
          <Icon
            name={IconName.CLOSE_ICON}
            fill={"#FFFFFF"}
            onClick={handleClose}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default VersionUpgradeBanner;

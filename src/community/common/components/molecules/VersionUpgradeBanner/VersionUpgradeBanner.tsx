import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { AppVersionNotificationType } from "~community/common/enums/CommonEnums";
import { ButtonSizes } from "~community/common/enums/ComponentEnums";
import { useVersionUpgradeStore } from "~community/common/stores/versionUpgradeStore";
import { IconName } from "~community/common/types/IconTypes";

import Button from "../../atoms/Button/Button";
import Icon from "../../atoms/Icon/Icon";

const VersionUpgradeBanner = () => {
  const { pathname } = useRouter();
  const {
    setIsDailyNotifyDisplayed,
    setShowInfoBanner,
    versionUpgradeInfo,
    clearVersionUpgradeInfo
  } = useVersionUpgradeStore((state) => state);

  const handleClose = () => {
    setIsDailyNotifyDisplayed(false);
    setShowInfoBanner(false);
    clearVersionUpgradeInfo();
  };

  const handleButtonClick = () => {
    window.open(versionUpgradeInfo?.redirectUrl, "_blank");
  };
  return (
    <Stack
      sx={{
        padding: "0.5rem 2.375rem",
        backgroundColor:
          versionUpgradeInfo?.type === AppVersionNotificationType.CRITICAL
            ? "#7F1D1D"
            : "#2A61A0",
        borderRadius: "0.5rem",
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: "1.5rem",
        alignItems: "center",
        display: pathname.includes("dashboard") ? "flex" : "none"
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          gap: "0.75rem"
        }}
      >
        <Icon name={IconName.UPGRADE_INFO_ICON} />
        <Typography
          variant="body1"
          sx={{
            color: "#FFFFFF"
          }}
        >
          {versionUpgradeInfo?.bannerDescription}
        </Typography>
      </Stack>
      <Stack
        sx={{
          flexDirection: "row",
          gap: 3
        }}
      >
        {versionUpgradeInfo?.buttonText && (
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

        <Icon
          name={IconName.CLOSE_ICON}
          fill={"#FFFFFF"}
          onClick={handleClose}
        />
      </Stack>
    </Stack>
  );
};

export default VersionUpgradeBanner;

import { Box, Stack, Typography } from "@mui/material";

import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useVersionUpgradeStore } from "~community/common/stores/versionUpgradeStore";
import { IconName } from "~community/common/types/IconTypes";

import Button from "../../atoms/Button/Button";
import Icon from "../../atoms/Icon/Icon";
import Modal from "../../organisms/Modal/Modal";

const VersionUpgradeModal = () => {
  const {
    setShowInfoModal,
    isWeeklyNotifyDisplayed,
    showInfoModal,
    setIsWeeklyNotifyDisplayed,
    versionUpgradeInfo,
    setShowInfoBanner,
    clearVersionUpgradeInfo
  } = useVersionUpgradeStore((state) => state);

  const handleCloseModal = () => {
    setShowInfoModal(false);
    setIsWeeklyNotifyDisplayed(true);
    setShowInfoBanner(false);
    clearVersionUpgradeInfo();
  };

  const handleButtonClick = () => {
    window.open(versionUpgradeInfo?.redirectUrl, "_blank");
  };
  return (
    <Modal
      isModalOpen={showInfoModal && !isWeeklyNotifyDisplayed}
      onCloseModal={handleCloseModal}
      title={""}
      isDividerVisible={false}
      customCloseIcon={<Icon name={IconName.CLOSE_ICON} />}
      modalContentStyles={{
        width: "19rem"
      }}
      modalHeaderStyles={{
        marginBottom: "0rem"
      }}
      modalChildrenStyles={{
        marginTop: "0rem"
      }}
    >
      <>
        <Box
          sx={{
            justifyItems: "center",
            marginBottom: "1.1875rem"
          }}
        >
          <Stack
            sx={{
              backgroundColor: "#408CE4",
              width: "max-content",
              borderRadius: "100%",
              padding: "0.625rem"
            }}
          >
            <Icon
              name={IconName.UPGRADE_INFO_ICON}
              height="91.5px"
              width="91.5px"
            />
          </Stack>
        </Box>
        <Stack
          sx={{
            justifyItems: "center",
            alignItems: "center"
          }}
          gap="1rem"
          padding={"0.1rem"}
        >
          <Typography variant="h3">{versionUpgradeInfo.popupTitle}</Typography>
          <Typography variant="body2" align="center">
            {versionUpgradeInfo.popupDescription}
          </Typography>
          <Button
            label={versionUpgradeInfo.buttonText}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSizes.SMALL}
            onClick={handleButtonClick}
            styles={{
              backgroundColor: "#93C5FD",
              ".MuiTypography-root": {
                color: "#408CE4"
              },
              "&:hover": {
                outline: "none",
                border: `0.125rem solid #408CE4`
              },
              outline: `0.0625rem solid #408CE4`
            }}
          />
        </Stack>
      </>
    </Modal>
  );
};

export default VersionUpgradeModal;

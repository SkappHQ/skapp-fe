import { Box } from "@mui/material";
import { JSX, memo } from "react";

import { useGetOrganization } from "~community/common/api/OrganizationCreateApi";
import { useCommonStore } from "~community/common/stores/commonStore";
import { SettingsModalTypes } from "~community/common/types/SettingsTypes";

import ChangeBrandingSettingsModal from "../../molecules/ChangeBrandingSettingsModal/ChangeBrandingSettingsModal";
import ChangeOrganizationSettingsModal from "../../molecules/ChangeOrganizationSettingsModal/ChangeOrganizationSettingsModal";
import ResetPasswordModal from "../../molecules/ResetPasswordModal/ResetPasswordModal";
import SetupEmailServerModal from "../../molecules/SetupEmailServerModal/SetupEmailServerModal";
import TestEmailServerModal from "../../molecules/TestEmailServerModal/TestEmailServerModal";

const SettingsModalController = (): JSX.Element => {
  const { modalType, isModalOpen, setModalOpen } = useCommonStore(
    (state) => state
  );

  const { data: organizationDetails } = useGetOrganization();

  const modalRender = (): JSX.Element => {
    switch (modalType) {
      case SettingsModalTypes.CHANGE_ORGANIZATION_SETTINGS:
        return (
          <ChangeOrganizationSettingsModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
        );
      case SettingsModalTypes.CHANGE_BRANDING_SETTINGS:
        return (
          <ChangeBrandingSettingsModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            themeColor={organizationDetails.results[0].themeColor}
            logo={organizationDetails.results[0].organizationLogo}
          />
        );
      case SettingsModalTypes.SETUP_EMAIL_SERVER:
        return (
          <SetupEmailServerModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
        );
      case SettingsModalTypes.TEST_EMAIL_SERVER:
        return (
          <TestEmailServerModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
        );
      case SettingsModalTypes.RESET_PASSWORD:
        return (
          <ResetPasswordModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
        );
      default:
        return <></>;
    }
  };

  return <Box>{modalRender()}</Box>;
};

export default memo(SettingsModalController);

import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { ChangeEvent, JSX } from "react";

import {
  useGetNotificationSettings,
  useUpdateNotificationSettings
} from "~community/common/api/settingsApi";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";

import SwitchRow from "../../atoms/SwitchRow/SwitchRow";
import ToastMessage from "../ToastMessage/ToastMessage";

const NotificationSettings = (): JSX.Element => {
  const translateText = useTranslator("settings");
  const { toastMessage, setToastMessage } = useToast();

  const { data: settings } = useGetNotificationSettings();

  const updateMutation = useUpdateNotificationSettings(() => {
    setToastMessage({
      open: true,
      toastType: ToastType.SUCCESS,
      title: translateText(["notificationSettingsUpdateSuccessTitle"]),
      description: translateText([
        "notificationSettingsUpdateSuccessDescription"
      ]),
      isIcon: true
    });
  });
  const handleSwitchChange = (
    event: ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [type]: event.target.checked };
    updateMutation.mutate(updatedSettings);
  };

  return (
    <Box>
      <Typography variant="h2">
        {translateText(["notificationSettingsTitle"])}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: 2
        }}
      >
        {translateText(["notificationSettingsDescription"])}
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: "32.875rem"
        }}
      >
        <Stack
          sx={{
            flexDirection: "column",
            gap: "1.5rem",
            my: "1rem"
          }}
        >
          {settings &&
            Object.keys(settings).map((key) => (
              <SwitchRow
                key={key}
                label={translateText([key])}
                checked={settings[key]}
                onChange={(event) => handleSwitchChange(event, key)}
              />
            ))}
        </Stack>
      </Box>
      <ToastMessage
        {...toastMessage}
        open={toastMessage.open}
        onClose={() => {
          setToastMessage((state) => ({ ...state, open: false }));
        }}
      />
    </Box>
  );
};

export default NotificationSettings;

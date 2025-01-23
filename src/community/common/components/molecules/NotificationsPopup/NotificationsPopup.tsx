import { Box, MenuItem } from "@mui/material";
import { rejects } from "assert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { JSX, Key } from "react";

import { useMarkNotificationAsRead } from "~community/common/api/notificationsApi";
import ROUTES from "~community/common/constants/routes";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useScreenSizeRange } from "~community/common/hooks/useScreenSizeRange";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { EmployeeTypes } from "~community/common/types/AuthTypes";
import { IconName } from "~community/common/types/IconTypes";
import {
  NotificationDataTypes,
  NotificationItemsTypes,
  NotifyFilterButtonTypes
} from "~community/common/types/notificationTypes";

import Button from "../../atoms/Button/Button";
import Icon from "../../atoms/Icon/Icon";
import NotificationContent from "../NotificationContent/NotificationContent";
import TableEmptyScreen from "../TableEmptyScreen/TableEmptyScreen";

interface Props {
  handleCloseMenu: () => void;
  filterButton: NotifyFilterButtonTypes;
  notifications: NotificationDataTypes[];
}

const NotificationsPopup = ({
  handleCloseMenu,
  notifications
}: Props): JSX.Element => {
  const { isSmallPhoneScreen } = useScreenSizeRange();
  const translateText = useTranslator("notifications");
  const router = useRouter();

  const handelAllNotification = (): void => {
    router.push(ROUTES.NOTIFICATIONS).catch(rejects);
    handleCloseMenu();
  };

  const { mutate } = useMarkNotificationAsRead();
  const { data: session } = useSession();

  const handelMenuRow = (
    id: number,
    notificationType: NotificationItemsTypes | null,
    isCausedByCurrentUser: boolean
  ): void => {
    if (
      isCausedByCurrentUser &&
      notificationType === NotificationItemsTypes.LEAVE_REQUEST &&
      session?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE)
    ) {
      router.push(ROUTES.LEAVE.MY_REQUESTS);
      handleCloseMenu();
    } else if (
      notificationType === NotificationItemsTypes.LEAVE_REQUEST &&
      session?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE)
    ) {
      router.push(ROUTES.LEAVE.LEAVE_REQUESTS);
      handleCloseMenu();
    } else if (
      isCausedByCurrentUser &&
      notificationType === NotificationItemsTypes.TIME_ENTRY &&
      session?.user?.roles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE)
    ) {
      router.push(ROUTES.TIMESHEET.MY_TIMESHEET);
      handleCloseMenu();
    } else if (
      notificationType === NotificationItemsTypes.TIME_ENTRY &&
      session?.user?.roles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE)
    ) {
      router.push(ROUTES.TIMESHEET.ALL_TIMESHEETS);
      handleCloseMenu();
    }
    mutate(id);
  };

  return (
    <Box
      sx={{
        maxHeight: isSmallPhoneScreen ? "44vh" : "calc(100vh - 25rem)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "0.25rem"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: "0.25rem"
        }
      }}
    >
      {notifications?.length === 0 ? (
        <TableEmptyScreen
          title={translateText(["emptyScreenTitle"])}
          description={translateText(["emptyScreenDescription"])}
          wrapperStyles={{ height: "100%", py: "3rem" }}
        />
      ) : (
        <>
          {notifications?.map(
            (item: NotificationDataTypes, index: Key | null | undefined) => (
              <MenuItem
                key={index}
                sx={{
                  pt: "1.75rem",
                  pb: "1rem",
                  cursor: item.isViewed ? "default" : "pointer",
                  "&:hover": { background: "transparent" }
                }}
                divider
                disableGutters
                disableRipple
                onClick={() => {
                  handelMenuRow(
                    item.id,
                    item.notificationType,
                    item.isCausedByCurrentUser
                  );
                }}
                tabIndex={0}
              >
                <NotificationContent item={item} />
              </MenuItem>
            )
          )}
          <Button
            buttonStyle={ButtonStyle.TERTIARY}
            label={translateText(["viewAllNotificationsButtonText"])}
            endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
            styles={{ mt: "1rem" }}
            onClick={handelAllNotification}
            disabled={notifications?.length === 0}
          />
        </>
      )}
    </Box>
  );
};

export default NotificationsPopup;

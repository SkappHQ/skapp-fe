import { Box, Theme, useTheme } from "@mui/material";
import React from "react";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Table from "~community/common/components/molecules/Table/Table";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { LeaveRequestStates } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { LeaveRequest } from "~community/leave/types/ResourceAvailabilityTypes";
import { getLeaveRequestState } from "~community/leave/utils/leaveRequest/LeaveRequestUtils";

interface OnLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  todaysAvailability: any;
}

const OnLeaveModal: React.FC<OnLeaveModalProps> = ({
  isOpen,
  onClose,
  title,
  todaysAvailability
}) => {
  const translateText = useTranslator(
    "leaveModule",
    "leaveRequests",
    "leaveRequestTable"
  );
  const theme: Theme = useTheme();

  const columns = [
    {
      field: "name",
      headerName: translateText(["name"]).toLocaleUpperCase()
    },
    { field: "type", headerName: translateText(["type"]).toLocaleUpperCase() },

    {
      field: "duration",
      headerName: translateText(["duration"]).toLocaleUpperCase()
    },
    {
      field: "reviewer",
      headerName: translateText(["reviewer"]).toLocaleUpperCase()
    }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  const transformToTableRows = () => {
    return todaysAvailability?.map((employeeLeaveRequest: LeaveRequest) => ({
      id: employeeLeaveRequest.leaveRequestId,
      name: (
        <AvatarChip
          firstName={employeeLeaveRequest?.employee?.firstName ?? ""}
          lastName={employeeLeaveRequest?.employee?.lastName ?? ""}
          avatarUrl={employeeLeaveRequest?.employee?.authPic ?? ""}
          isResponsiveLayout
          chipStyles={{
            maxWidth: "15.625rem"
          }}
        />
      ),

      type: (
        <IconChip
          label={employeeLeaveRequest?.leaveType?.name}
          icon={employeeLeaveRequest?.leaveType?.emojiCode}
          isResponsive={true}
          chipStyles={{
            alignSelf: "center",
            [`@media (max-width: 81.25rem)`]: {
              marginLeft: "2rem"
            }
          }}
          isTruncated={!theme.breakpoints.up("xl")}
        />
      ),
      duration: (
        <BasicChip
          label={getLeaveRequestState(
            employeeLeaveRequest.leaveState,
            translateText
          )}
        />
      ),
      reviewer: employeeLeaveRequest.reviewer ? (
        <AvatarChip
          firstName={employeeLeaveRequest?.reviewer?.firstName ?? ""}
          lastName={employeeLeaveRequest?.reviewer?.lastName ?? ""}
          avatarUrl={employeeLeaveRequest?.reviewer?.authPic ?? ""}
          isResponsiveLayout
          chipStyles={{
            maxWidth: "15.625rem"
          }}
        />
      ) : (
        <IconChip
          label={LeaveRequestStates.PENDING}
          icon={<Icon name={IconName.PENDING_STATUS_ICON} />}
          isResponsive={true}
          isTruncated={false}
          mediumScreenWidth={1024}
        />
      )
    }));
  };

  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={onClose}
      title={title}
      isClosable={true}
      modalContentStyles={{ maxWidth: { md: "64rem" } }}
    >
      <Box sx={{ pt: 1 }}>
        <Table
          tableHeaders={tableHeaders}
          tableRows={transformToTableRows()}
          emptyDataTitle={translateText(["allAvailable"])}
          skeletonRows={5}
          isPaginationEnabled={false}
        />
      </Box>
    </Modal>
  );
};

export default OnLeaveModal;

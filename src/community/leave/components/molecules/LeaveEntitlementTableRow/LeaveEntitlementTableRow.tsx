import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC } from "react";

import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import { formatToFiveDecimalPlaces } from "~community/common/utils/numberUtils";
import { LeaveTypeType } from "~community/leave/types/AddLeaveTypes";
import { LeaveAllocationType } from "~community/leave/types/LeaveEntitlementTypes";

import { tableRowStyles } from "./styles";

interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  authPic: string;
}

interface Props {
  employee: Employee;
  totalAllocations: LeaveAllocationType[];
  leaveTypes?: LeaveTypeType[];
}

const LeaveEntitlementTableRow: FC<Props> = ({
  employee,
  totalAllocations,
  leaveTypes
}) => {
  const theme: Theme = useTheme();
  const styles = tableRowStyles(theme);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={styles.rowContainer}
    >
      <Box sx={styles.stickyColumn}>
        {employee?.firstName && employee?.lastName ? (
          <AvatarChip
            firstName={employee?.firstName}
            lastName={employee?.lastName}
            avatarUrl={employee?.authPic}
            isResponsiveLayout={true}
            chipStyles={{
              maxWidth: "100%",
              justifyContent: "flex-start"
            }}
            mediumScreenWidth={1024}
            smallScreenWidth={0}
          />
        ) : null}
      </Box>

      {leaveTypes?.map((leaveType: LeaveTypeType, index: number) => {
        const allocation = totalAllocations.find(
          (alloc) => alloc.leaveTypeId === leaveType.typeId
        );

        const totalDaysAllocated = allocation
          ? formatToFiveDecimalPlaces(parseFloat(allocation.totalDaysAllocated))
          : "-";

        return (
          <Box key={index} sx={styles.cell}>
            <Typography sx={styles.holidayText}>
              {totalDaysAllocated}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
};

export default LeaveEntitlementTableRow;

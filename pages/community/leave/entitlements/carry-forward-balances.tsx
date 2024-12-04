import { Box } from "@mui/material";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import ROUTES from "~community/common/constants/routes";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useGetUseCarryForwardLeaveEntitlements } from "~community/leave/api/LeaveApi";
import CarryForwardTable from "~community/leave/components/molecules/CarryForwardTable/CarryForwardTable";
import LeaveCarryForwardModalController from "~community/leave/components/organisms/LeaveCarryForwardModalController/LeaveCarryForwardModalController";
import { useLeaveStore } from "~community/leave/store/store";
import { LeaveCarryForwardModalTypes } from "~community/leave/types/LeaveCarryForwardTypes";

const CarryForwardBalances: NextPage = () => {
  const translateText = useTranslator("leaveModule", "leaveCarryForward");
  const {
    carryForwardLeaveTypes,
    leaveCarryForwardId,
    setIsLeaveCarryForwardModalOpen,
    setLeaveCarryForwardModalType
  } = useLeaveStore((state) => state);

  const [checkedList] = useState<number[]>(leaveCarryForwardId);
  const [rows, setRows] = useState<any[]>([]);
  const router = useRouter();
  const { data: carryForwardEntitlement } =
    useGetUseCarryForwardLeaveEntitlements(checkedList);
  const getLeaveTypeNames = (carryForwardLeaveTypes: any) => {
    return carryForwardLeaveTypes?.map((leaveType: any) => leaveType.name);
  };

  useEffect(() => {
    const row = carryForwardEntitlement?.items.map((item: any) => {
      const employeeName = `${item?.employee?.firstName} ${item?.employee?.lastName}`;
      const employeeData = {
        id: item?.employee?.employeeId,
        name: employeeName,
        email: item?.employee?.email
      };
      const entitlements = getLeaveTypeNames(carryForwardLeaveTypes).map(
        (header: string) => {
          const entitlement = item.entitlements.find(
            (ent: any) => ent.name.toUpperCase() === header.toUpperCase()
          );
          return entitlement && entitlement.carryForwardAmount !== 0
            ? entitlement.carryForwardAmount
            : "-";
        }
      );

      return { name: employeeName, entitlements, employeeData };
    });

    setRows(row);
  }, [carryForwardEntitlement, checkedList]);

  const handleSync = () => {
    setIsLeaveCarryForwardModalOpen(true);
    setLeaveCarryForwardModalType(
      LeaveCarryForwardModalTypes.CARRY_FORWARD_CONFIRM_SYNCHRONIZATION
    );
  };
  const onBackClick = () => {
    router.push(ROUTES.LEAVE.LEAVE_ENTITLEMENTS);
  };

  return (
    <>
      <ContentLayout
        pageHead={translateText(["carryForwardingBalance.pageHead"])}
        title={translateText(["carryForwardingBalance.title"])}
        isDividerVisible={true}
        isBackButtonVisible
        onBackClick={onBackClick}
      >
        <>
          <CarryForwardTable
            leaveHeaders={getLeaveTypeNames(carryForwardLeaveTypes)}
            recordData={rows}
            totalPage={carryForwardEntitlement?.totalPages}
          />
          <Box
            sx={{
              marginTop: "1.5rem",
              width: "full",
              flexDirection: "row",
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <Button
              styles={{
                width: "fit-content",
                paddingY: "1.25rem",
                paddingX: "2.5rem",
                fontSize: "1rem"
              }}
              label={
                translateText(["leaveCarryForwardBallancePageSyncButton"]) ?? ""
              }
              endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
              isFullWidth={false}
              onClick={handleSync}
            />
          </Box>
          <LeaveCarryForwardModalController />
        </>
      </ContentLayout>
    </>
  );
};

export default CarryForwardBalances;

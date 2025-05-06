import { Box } from "@mui/material";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

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
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";

const CarryForwardBalance: NextPage = () => {
  const router = useRouter();

  const translateText = useTranslator("leaveModule", "leaveCarryForward");

  const {
    leaveCarryForwardSyncBtnStatus,
    setIsLeaveCarryForwardModalOpen,
    setLeaveCarryForwardModalType
  } = useLeaveStore((state) => ({
    leaveCarryForwardSyncBtnStatus: state.leaveCarryForwardSyncBtnStatus,
    setIsLeaveCarryForwardModalOpen: state.setIsLeaveCarryForwardModalOpen,
    setLeaveCarryForwardModalType: state.setLeaveCarryForwardModalType
  }));

  const checkedList = useMemo(() => {
    const { id } = router.query;
    return id ? (id as string).split(",").map(Number) : [];
  }, [router.query]);

  const { data: carryForwardLeaveEntitlementData } =
    useGetUseCarryForwardLeaveEntitlements(checkedList);

  const leaveHeaders = useMemo(() => {
    return (
      carryForwardLeaveEntitlementData?.items[0]?.entitlements.map(
        (entitlement: any) => entitlement.name
      ) ?? []
    );
  }, [carryForwardLeaveEntitlementData]);

  console.log(
    "carryForwardLeaveEntitlementData: ",
    carryForwardLeaveEntitlementData
  );

  const recordData = useMemo(() => {}, [carryForwardLeaveEntitlementData]);

  // const handleSync = () => {
  //   setIsLeaveCarryForwardModalOpen(true);
  //   setLeaveCarryForwardModalType(
  //     LeaveCarryForwardModalTypes.CARRY_FORWARD_CONFIRM_SYNCHRONIZATION
  //   );
  // };

  useGoogleAnalyticsEvent({
    onMountEventType:
      GoogleAnalyticsTypes.GA4_LEAVE_CARRY_FORWARD_BALANCE_VIEWED,
    triggerOnMount: true
  });

  return (
    <>
      <ContentLayout
        pageHead={translateText(["carryForwardingBalance.pageHead"])}
        title={translateText(["carryForwardingBalance.title"])}
        isDividerVisible={true}
        isBackButtonVisible
        onBackClick={() => router.push(ROUTES.LEAVE.LEAVE_ENTITLEMENTS)}
      >
        <>
          {/* <CarryForwardTable
            leaveHeaders={leaveHeaders}
            recordData={recordData}
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
              disabled={leaveCarryForwardSyncBtnStatus.isDisabled}
              isLoading={leaveCarryForwardSyncBtnStatus.isLoading}
              onClick={handleSync}
            />
          </Box>
          <LeaveCarryForwardModalController /> */}
        </>
      </ContentLayout>
    </>
  );
};

export default CarryForwardBalance;

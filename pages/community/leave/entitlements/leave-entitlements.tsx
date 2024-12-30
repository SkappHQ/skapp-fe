import { Divider } from "@mui/material";
import { NextPage } from "next";
import { useEffect } from "react";

import LeaveCarryForward from "~community/common/components/molecules/LeaveCarryForward/LeaveCarryForward";
import SearchBox from "~community/common/components/molecules/SearchBox/SearchBox";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useGetLeaveTypes } from "~community/leave/api/LeaveApi";
import { useGetLeaveEntitlements } from "~community/leave/api/LeaveEntitlementApi";
import LeaveEntitlementTable from "~community/leave/components/molecules/LeaveEntitlementTable/LeaveEntitlementTable";
import CustomLeaveAllocationContent from "~community/leave/components/organisms/CustomLeaveAllocationContent/CustomLeaveAllocationContent";
import LeaveEntitlementModalController from "~community/leave/components/organisms/LeaveEntitlementModalController/LeaveEntitlementModalController";
import { LeaveEntitlementModelTypes } from "~community/leave/enums/LeaveEntitlementEnums";
import { useLeaveStore } from "~community/leave/store/store";

const LeaveEntitlements: NextPage = () => {
  const translateText = useTranslator("leaveModule", "leaveEntitlements");

  const { data: leaveTypesList } = useGetLeaveTypes(false, true);

  const { setLeaveTypes } = useLeaveStore((state) => state);

  useEffect(() => {
    setLeaveTypes(leaveTypesList ?? []);
  }, [leaveTypesList, setLeaveTypes]);

  const {
    page,
    leaveEntitlementTableSelectedYear,
    setLeaveEntitlementModalType
  } = useLeaveStore((state) => state);

  const { data: leaveEntitlementTableData, isFetching } =
    useGetLeaveEntitlements(leaveEntitlementTableSelectedYear, page);

  return (
    <>
      <ContentLayout
        title={translateText(["title"])}
        pageHead={translateText(["pageHead"])}
        isDividerVisible
        primaryButtonType={ButtonStyle.SECONDARY}
        primaryButtonText={
          leaveEntitlementTableData &&
          leaveEntitlementTableData?.items.length > 0 &&
          translateText(["bulkUploadBtnTxt"])
        }
        primaryBtnIconName={IconName.UP_ARROW_ICON}
        onPrimaryButtonClick={() =>
          setLeaveEntitlementModalType(
            leaveEntitlementTableData?.items?.length === 0
              ? LeaveEntitlementModelTypes.DOWNLOAD_CSV
              : LeaveEntitlementModelTypes.OVERRIDE_CONFIRMATION
          )
        }
      >
        <>
          {leaveEntitlementTableData &&
            leaveEntitlementTableData?.items.length > 0 && (
              <SearchBox
                placeHolder={translateText(["searchBoxPlaceholder"])}
              />
            )}
          <LeaveEntitlementTable
            tableData={leaveEntitlementTableData}
            isFetching={isFetching}
          />
          <Divider sx={{ my: "1.5rem" }} />
          <LeaveCarryForward />
          <Divider sx={{ my: "1.5rem" }} />
          <CustomLeaveAllocationContent />
          <LeaveEntitlementModalController />
        </>
      </ContentLayout>
    </>
  );
};

export default LeaveEntitlements;

import { DateTime } from "luxon";
import { type NextPage } from "next";

import Dropdown from "~community/common/components/molecules/Dropdown/Dropdown";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { getCurrentAndNextYear } from "~community/common/utils/dateTimeUtils";
import { useGetLeaveAllocation } from "~community/leave/api/MyRequestApi";
import LeaveAllocation from "~community/leave/components/molecules/LeaveAllocation/LeaveAllocation";
import LeaveRequests from "~community/leave/components/molecules/LeaveRequests/LeaveRequests";
import EmployeeLeaveStatusPopupController from "~community/leave/components/organisms/EmployeeLeaveStatusPopupController/EmployeeLeaveStatusPopupController";
import { useLeaveStore } from "~community/leave/store/store";

const MyRequests: NextPage = () => {
  const translateText = useTranslator("leaveModule", "myRequests");

  const { selectedYear, setSelectedYear } = useLeaveStore((state) => state);

  const now = DateTime.now();
  const nextYear = now.plus({ years: 1 }).year;
  const { data: isEntitlementAvailableNextYear } = useGetLeaveAllocation(
    nextYear.toString()
  );

  return (
    <ContentLayout
      pageHead={translateText(["pageHead"])}
      title={translateText(["title"])}
      isDividerVisible={true}
      customRightContent={
        isEntitlementAvailableNextYear &&
        isEntitlementAvailableNextYear.length !== 0 ? (
          <Dropdown
            onItemClick={(event) =>
              setSelectedYear(event?.currentTarget?.innerText)
            }
            selectedItem={selectedYear}
            title={selectedYear}
            items={getCurrentAndNextYear()}
          />
        ) : (
          <></>
        )
      }
    >
      <>
        <LeaveAllocation />
        <LeaveRequests />
        <EmployeeLeaveStatusPopupController />
      </>
    </ContentLayout>
  );
};

export default MyRequests;

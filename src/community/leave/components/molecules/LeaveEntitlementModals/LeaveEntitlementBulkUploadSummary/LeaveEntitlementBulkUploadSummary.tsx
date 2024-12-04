import { Dispatch, FC, SetStateAction } from "react";

import BulkUploadSummary from "~community/common/components/molecules/BulkUploadSummary/BulkUploadSummary";
import { BulkUploadResponse } from "~community/common/types/BulkUploadTypes";
import { downloadBulkUploadErrorLogsCSV } from "~community/common/utils/bulkUploadUtils";
import { LeaveTypeType } from "~community/leave/types/AddLeaveTypes";

interface Props {
  leaveTypes: LeaveTypeType[];
  errorLog: BulkUploadResponse | null;
  setErrorLog: Dispatch<SetStateAction<BulkUploadResponse | null>>;
}

const LeaveEntitlementBulkUploadSummary: FC<Props> = ({
  leaveTypes,
  errorLog,
  setErrorLog
}) => {
  const handleDownloadErrorLogCSV = () => {
    downloadBulkUploadErrorLogsCSV(errorLog as BulkUploadResponse, leaveTypes);
    setErrorLog(null);
  };

  return (
    <BulkUploadSummary
      successCount={errorLog?.bulkStatusSummary?.successCount ?? 0}
      failedCount={errorLog?.bulkStatusSummary?.failedCount ?? 0}
      onClick={handleDownloadErrorLogCSV}
    />
  );
};

export default LeaveEntitlementBulkUploadSummary;

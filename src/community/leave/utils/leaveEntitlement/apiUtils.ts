import { SetStateAction } from "react";

import { ToastType } from "~community/common/enums/ComponentEnums";
import { ToastProps } from "~community/common/types/ToastTypes";
import { LeaveEntitlementToastEnums } from "~community/leave/enums/LeaveEntitlementEnums";

interface HandleLeaveEntitlementApiResponseProps {
  type: LeaveEntitlementToastEnums;
  setToastMessage: (value: SetStateAction<ToastProps>) => void;
  translateText: (key: string[], data?: Record<string, unknown>) => string;
  selectedYear?: string;
  noOfRecords?: number;
}

export const handleLeaveEntitlementApiResponse = ({
  type,
  setToastMessage,
  translateText,
  selectedYear,
  noOfRecords
}: HandleLeaveEntitlementApiResponseProps) => {
  switch (type) {
    case LeaveEntitlementToastEnums.BULK_UPLOAD_PARTIAL_SUCCESS:
      setToastMessage({
        open: true,
        toastType: ToastType.SUCCESS,
        title: translateText(["toastMessages.bulkUploadPartialSuccessTitle"], {
          selectedYear: selectedYear
        }),
        description: translateText(
          ["toastMessages.bulkUploadPartialSuccessDescription"],
          {
            noOfRecords: noOfRecords
          }
        )
      });
      break;
    case LeaveEntitlementToastEnums.BULK_UPLOAD_COMPLETE_SUCCESS:
      setToastMessage({
        open: true,
        toastType: ToastType.SUCCESS,
        title: translateText(["toastMessages.bulkUploadCompleteSuccessTitle"]),
        description: translateText([
          "toastMessages.bulkUploadCompleteSuccessDescription"
        ])
      });
      break;
    case LeaveEntitlementToastEnums.BULK_UPLOAD_ERROR:
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["toastMessages.bulkUploadErrorTitle"]),
        description: translateText(["toastMessages.bulkUploadErrorDescription"])
      });
      break;
    default:
      break;
  }
};

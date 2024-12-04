import { parse } from "papaparse";
import { Dispatch, SetStateAction } from "react";

import { FileUploadType } from "~community/common/types/CommonTypes";
import { LeaveTypeType } from "~community/leave/types/AddLeaveTypes";
import { LeaveEntitlementBulkUploadType } from "~community/leave/types/LeaveEntitlementTypes";

import {
  createLeaveEntitlementBulkUploadPayload,
  transformCSVHeaders,
  validateHeaders
} from "./leaveEntitlementUtils";

interface SetAttachmentProps {
  acceptedFiles: FileUploadType[];
  leaveTypes: LeaveTypeType[];
  selectedYear: string;
  setCustomError: Dispatch<SetStateAction<string>>;
  setIsInvalid: Dispatch<SetStateAction<boolean>>;
  setLeaveEntitlementBulk: Dispatch<
    SetStateAction<LeaveEntitlementBulkUploadType[]>
  >;
  setBulkUserAttachment: Dispatch<SetStateAction<FileUploadType[]>>;
  translateText: (keys: string[]) => string;
}

export const setAttachment = async ({
  acceptedFiles,
  leaveTypes,
  selectedYear,
  setCustomError,
  setIsInvalid,
  setLeaveEntitlementBulk,
  setBulkUserAttachment,
  translateText
}: SetAttachmentProps): Promise<void> => {
  setBulkUserAttachment(acceptedFiles);
  setCustomError("");
  setIsInvalid(false);

  if (acceptedFiles?.length > 0) {
    const areHeadersValid = await validateHeaders(
      acceptedFiles[0].file ?? new File([], ""),
      leaveTypes ?? []
    );

    if (areHeadersValid) {
      parse(acceptedFiles?.[0].file as File, {
        header: true,
        skipEmptyLines: true,
        transformHeader: transformCSVHeaders,
        complete: function (recordDetails) {
          if (recordDetails?.data?.length === 0) {
            setIsInvalid(true);
            setCustomError(translateText(["emptyFileError"]));
          } else {
            const preProcessedEntitlements =
              createLeaveEntitlementBulkUploadPayload(
                recordDetails?.data as LeaveEntitlementBulkUploadType[],
                leaveTypes ?? [],
                selectedYear ?? ""
              );
            setLeaveEntitlementBulk(preProcessedEntitlements);
          }
        }
      });
    } else {
      setIsInvalid(true);
      setCustomError(translateText(["invalidTemplateError"]));
    }
  } else {
    setBulkUserAttachment([]);
  }
};

import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import { BulkUploadResponse } from "~community/common/types/BulkUploadTypes";
import {
  SortKeyTypes,
  SortOrderTypes
} from "~community/common/types/CommonTypes";
import authFetch from "~community/common/utils/axiosInterceptor";
import { leaveEntitlementEndPoints } from "~community/leave//api/utils/ApiEndpoints";
import { leaveEntitlementQueryKeys } from "~community/leave/api/utils/QueryKeys";
import {
  LeaveEntitlementBulkPayloadType,
  LeaveEntitlementResponseType
} from "~community/leave/types/LeaveEntitlementTypes";

export const useGetLeaveEntitlements = (
  selectedYear: string,
  page: number
): UseQueryResult<LeaveEntitlementResponseType> => {
  const pageParams = {
    page: page - 1,
    size: 9,
    year: selectedYear,
    isExport: false,
    sortOrder: SortOrderTypes.ASC,
    sortKey: SortKeyTypes.CREATED_DATE
  };

  return useQuery({
    queryKey: leaveEntitlementQueryKeys.LEAVE_ENTITLEMENTS(pageParams),
    queryFn: () =>
      authFetch.get(leaveEntitlementEndPoints.GET_LEAVE_ENTITLEMENTS, {
        params: pageParams
      }),
    select: (data) => {
      const results = data.data.results[0] ?? [];

      return results;
    }
  });
};

export const useLeaveEntitlementBulkUpload = (
  onSuccess: (errorLogs: BulkUploadResponse) => void,
  onError: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveEntitlementBulk: LeaveEntitlementBulkPayloadType) => {
      return authFetch.post(
        leaveEntitlementEndPoints.ADD_BULK_LEAVE_ENTITLEMENTS,
        leaveEntitlementBulk
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: leaveEntitlementQueryKeys.LEAVE_ENTITLEMENTS()
      });
      const results = data.data.results[0] ?? [];

      onSuccess(results);
    },
    onError
  });
};

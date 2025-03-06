import { NextRouter } from "next/router";
import * as React from "react";

import ROUTES from "~community/common/constants/routes";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { ToastProps } from "~community/common/types/ToastTypes";
import { LeaveTypeToastEnums } from "~community/leave/enums/LeaveTypeEnums";
import {
  QuickSetupModalTypeEnums,
  QuickSetupTaskEnums
} from "~enterprise/common/enums/Common";

export const handleLeaveTypeApiResponse =
  ({
    type,
    setToastMessage,
    translateText,
    setFormDirty,
    redirect,
    setOngoingQuickSetup,
    setQuickSetupModalType
  }: {
    type: LeaveTypeToastEnums;
    setToastMessage: (value: React.SetStateAction<ToastProps>) => void;
    translateText: (key: string[]) => string;
    setFormDirty?: (value: boolean) => void;
    redirect?: NextRouter["replace"];
    setOngoingQuickSetup?: (key: QuickSetupTaskEnums, value: boolean) => void;
    setQuickSetupModalType?: (value: QuickSetupModalTypeEnums) => void;
  }) =>
  async () => {
    switch (type) {
      case LeaveTypeToastEnums.ADD_LEAVE_TYPE_SUCCESS:
        setToastMessage({
          open: true,
          toastType: ToastType.SUCCESS,
          title: translateText(["addLeaveTypeSuccessToastTitle"]),
          description: translateText(["addLeaveTypeSuccessToastDescription"])
        });
        setFormDirty?.(false);
        await redirect?.(ROUTES.LEAVE.LEAVE_TYPES);
        setOngoingQuickSetup?.(QuickSetupTaskEnums.SETUP_LEAVE_TYPES, false);
        setQuickSetupModalType?.(QuickSetupModalTypeEnums.IN_PROGRESS_START_UP);
        break;
      case LeaveTypeToastEnums.ADD_LEAVE_TYPE_ERROR:
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: translateText(["leaveTypeErrorToastTitle"]),
          description: translateText(["addLeaveTypeErrorToastDescription"])
        });
        break;
      case LeaveTypeToastEnums.EDIT_LEAVE_TYPE_SUCCESS:
        setToastMessage({
          open: true,
          toastType: ToastType.SUCCESS,
          title: translateText(["editLeaveTypeSuccessToastTitle"]),
          description: translateText(["editLeaveTypeSuccessToastDescription"])
        });
        setFormDirty?.(false);
        redirect?.(ROUTES.LEAVE.LEAVE_TYPES);
        break;
      case LeaveTypeToastEnums.EDIT_LEAVE_TYPE_ERROR:
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: translateText(["leaveTypeErrorToastTitle"]),
          description: translateText(["editLeaveTypeErrorToastDescription"])
        });
        break;
      default:
        break;
    }
  };

import { DateTime } from "luxon";

import {
  FileUploadType,
  LeaveStates
} from "~community/common/types/CommonTypes";
import { DurationSelectorDisabledOptions } from "~community/common/types/MoleculeTypes";
import {
  getHolidaysWithinDateRange,
  getLeaveRequestsWithinDateRange
} from "~community/common/utils/calendarDateRangePickerUtils";
import { LeaveDurationTypes } from "~community/leave/enums/LeaveTypeEnums";
import {
  HolidayType,
  LeaveAllocationDataTypes,
  MyLeaveRequestPayloadType,
  ResourceAvailabilityPayload
} from "~community/leave/types/MyRequests";
import { HolidayDurationType } from "~community/people/types/HolidayTypes";

export const getDurationInitialValue = (
  duration: LeaveDurationTypes
): LeaveStates => {
  if (duration === LeaveDurationTypes.HALF_DAY) {
    return LeaveStates.MORNING;
  }
  return LeaveStates.FULL_DAY;
};

interface GetDurationSelectorDisabledOptionsProps {
  selectedDates: DateTime[];
  duration: LeaveDurationTypes;
  myLeaveRequests: MyLeaveRequestPayloadType[] | undefined;
  resourceAvailability: ResourceAvailabilityPayload[] | undefined;
}

export const getDurationSelectorDisabledOptions = ({
  selectedDates,
  duration,
  myLeaveRequests,
  resourceAvailability
}: GetDurationSelectorDisabledOptionsProps): DurationSelectorDisabledOptions => {
  const disabledOptions: DurationSelectorDisabledOptions = {
    fullDay: false,
    halfDayMorning: false,
    halfDayEvening: false
  };

  const applyDurationConstraints = (
    options: DurationSelectorDisabledOptions
  ): DurationSelectorDisabledOptions => {
    switch (duration) {
      case LeaveDurationTypes.FULL_DAY:
        return { ...options, halfDayMorning: true, halfDayEvening: true };
      case LeaveDurationTypes.HALF_DAY:
        return { ...options, fullDay: true };
      case LeaveDurationTypes.NONE:
        return { fullDay: true, halfDayMorning: true, halfDayEvening: true };
      default:
        return options; // Leave all options as is for HALF_AND_FULL_DAY
    }
  };

  const holidays = getHolidaysWithinDateRange({
    selectedDates,
    resourceAvailability
  });

  const handleHolidayDuration = (holiday: HolidayType) => {
    switch (holiday.holidayDuration) {
      case HolidayDurationType.FULLDAY:
        return { fullDay: true, halfDayMorning: true, halfDayEvening: true };
      case HolidayDurationType.HALFDAY_MORNING:
        return { fullDay: true, halfDayMorning: true, halfDayEvening: false };
      case HolidayDurationType.HALFDAY_EVENING:
        return { fullDay: true, halfDayMorning: false, halfDayEvening: true };
      default:
        return disabledOptions;
    }
  };

  if (holidays.length > 0) {
    const holidayOptions =
      selectedDates.length === 1
        ? handleHolidayDuration(holidays[0])
        : { fullDay: true, halfDayMorning: true, halfDayEvening: true };

    return applyDurationConstraints(holidayOptions);
  }

  const leaveRequests = getLeaveRequestsWithinDateRange({
    selectedDates,
    myLeaveRequests
  });

  const handleLeaveRequestState = (leaveRequest: MyLeaveRequestPayloadType) => {
    switch (leaveRequest.leaveState) {
      case LeaveStates.FULL_DAY:
        return { fullDay: true, halfDayMorning: true, halfDayEvening: true };
      case LeaveStates.MORNING:
        return { fullDay: true, halfDayMorning: true, halfDayEvening: false };
      case LeaveStates.EVENING:
        return { fullDay: true, halfDayMorning: false, halfDayEvening: true };
      default:
        return disabledOptions;
    }
  };

  if (leaveRequests.length > 0) {
    const leaveOptions =
      selectedDates.length === 1
        ? handleLeaveRequestState(leaveRequests[0])
        : { fullDay: true, halfDayMorning: true, halfDayEvening: true };

    return applyDurationConstraints(leaveOptions);
  }

  if (selectedDates.length > 1) {
    const dateRangeDisableOptions = {
      fullDay: false,
      halfDayMorning: true,
      halfDayEvening: true
    };

    return applyDurationConstraints(dateRangeDisableOptions);
  }

  return applyDurationConstraints(disabledOptions);
};

interface GetApplyLeaveFormValidationErrorsProps {
  selectedDates: DateTime[];
  comment: string;
  attachments: FileUploadType[];
  selectedLeaveAllocationData: LeaveAllocationDataTypes;
  setFormErrors: (key: string, value: string) => void;
  translateText: (key: string[]) => string;
}

export const getApplyLeaveFormValidationErrors = ({
  selectedDates,
  comment,
  attachments,
  selectedLeaveAllocationData,
  setFormErrors,
  translateText
}: GetApplyLeaveFormValidationErrorsProps) => {
  let isValid = true;
  let commentError = "";
  let attachmentError = "";

  if (!selectedDates.length) {
    setFormErrors(
      "selectedDates",
      translateText(["errorTexts.selectDatesRequired"])
    );
    isValid = false;
  } else {
    setFormErrors("selectedDates", "");
  }

  if (selectedLeaveAllocationData.leaveType.isCommentMandatory && !comment) {
    commentError = translateText(["errorTexts.commentRequired"]);
    isValid = false;
  }

  if (
    selectedLeaveAllocationData.leaveType.isAttachmentMandatory &&
    !attachments.length
  ) {
    attachmentError = translateText(["errorTexts.attachmentRequired"]);
    isValid = false;
  }

  if (commentError && attachmentError) {
    setFormErrors(
      "attachment",
      translateText(["errorTexts.commentAndAttachmentRequired"])
    );
    setFormErrors(
      "comment",
      translateText(["errorTexts.commentAndAttachmentRequired"])
    );
  } else {
    setFormErrors("comment", commentError);
    setFormErrors("attachment", attachmentError);
  }

  return isValid;
};

import { Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo } from "react";

import { useUploadImages } from "~community/common/api/FileHandleApi";
import { useStorageAvailability } from "~community/common/api/StorageAvailabilityApi";
import Button from "~community/common/components/atoms/Button/Button";
import TextArea from "~community/common/components/atoms/TextArea/TextArea";
import CalendarDateRangePicker from "~community/common/components/molecules/CalendarDateRangePicker/CalendarDateRangePicker";
import DurationSelector from "~community/common/components/molecules/DurationSelector/DurationSelector";
import { FileTypes } from "~community/common/enums/CommonEnums";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { LeaveStates } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import {
  convertToYYYYMMDDFromDateTime,
  getFirstDateOfYear,
  getMaxDateOfYear,
  getMonthStartAndEndDates
} from "~community/common/utils/dateTimeUtils";
import { NINETY_PERCENT } from "~community/common/utils/getConstants";
import { useDefaultCapacity } from "~community/configurations/api/timeConfigurationApi";
import {
  useApplyLeave,
  useGetLeaveEntitlementBalance,
  useGetMyRequests,
  useGetResourceAvailability
} from "~community/leave/api/MyRequestApi";
import AttachmentSummary from "~community/leave/components/molecules/AttachmentSummary/AttachmentSummary";
import LeaveEntitlementBalanceCard from "~community/leave/components/molecules/LeaveEntitlementBalanceCard/LeaveEntitlementBalanceCard";
import LeaveSummary from "~community/leave/components/molecules/LeaveSummary/LeaveSummary";
import TeamAvailabilityCard from "~community/leave/components/molecules/TeamAvailabilityCard/TeamAvailabilityCard";
import {
  ApplyLeaveToastEnums,
  LeaveStatusEnums,
  MyRequestModalEnums
} from "~community/leave/enums/MyRequestEnums";
import { useLeaveStore } from "~community/leave/store/store";
import { handleApplyLeaveApiResponse } from "~community/leave/utils/myRequests/apiUtils";
import {
  getApplyLeaveFormValidationErrors,
  getDurationInitialValue,
  getDurationSelectorDisabledOptions
} from "~community/leave/utils/myRequests/applyLeaveModalUtils";
import { useGetMyTeams } from "~community/people/api/TeamApi";

import styles from "./styles";

const ApplyLeaveModal = () => {
  const classes = styles();

  const { setToastMessage } = useToast();
  const translateStorageText = useTranslator("StorageToastMessage");
  const translateText = useTranslator(
    "leaveModule",
    "myRequests",
    "applyLeaveModal"
  );

  const {
    comment,
    attachments,
    formErrors,
    selectedTeam,
    selectedYear,
    selectedMonth,
    selectedDates,
    selectedDuration,
    selectedLeaveAllocationData,
    setComment,
    setSelectedTeam,
    setSelectedDates,
    setSelectedMonth,
    setSelectedDuration,
    setFormErrors,
    setAttachments,
    setMyLeaveRequestModalType
  } = useLeaveStore();

  const firstDateOfYear = useMemo(
    () => getFirstDateOfYear(DateTime.now().year).toJSDate(),
    []
  );

  const lastDateOfYear = useMemo(() => getMaxDateOfYear().toJSDate(), []);

  const { data: timeConfig } = useDefaultCapacity();

  const { data: myTeams } = useGetMyTeams();

  const { data: myLeaveRequests } = useGetMyRequests();

  const { data: leaveEntitlementBalance } = useGetLeaveEntitlementBalance(
    selectedLeaveAllocationData.leaveType.typeId
  );

  const { data: storageAvailabilityData } = useStorageAvailability();

  const onSuccess = () => {
    handleApplyLeaveApiResponse({
      type: ApplyLeaveToastEnums.APPLY_LEAVE_SUCCESS,
      setToastMessage,
      translateText
    });
    setMyLeaveRequestModalType(MyRequestModalEnums.NONE);
  };

  const onError = () => {
    handleApplyLeaveApiResponse({
      type: ApplyLeaveToastEnums.APPLY_LEAVE_ERROR,
      setToastMessage,
      translateText
    });
  };

  const { mutate: uploadAttachments } = useUploadImages();

  const { mutate: applyLeaveMutate, isPending: isLeaveApplyPending } =
    useApplyLeave(selectedYear, onSuccess, onError);

  const pendingAndApprovedLeaveRequests = useMemo(() => {
    return (
      myLeaveRequests?.filter(
        (request) =>
          request.status === LeaveStatusEnums.PENDING ||
          request.status === LeaveStatusEnums.APPROVED
      ) || []
    );
  }, [myLeaveRequests]);

  const startAndEndDates = useMemo(
    () => getMonthStartAndEndDates(selectedMonth),
    [selectedMonth]
  );

  const workingDays = useMemo(
    () => timeConfig?.map((config) => config.day) || [],
    [timeConfig]
  );

  useEffect(() => {
    if (!selectedTeam && myTeams && myTeams.length > 0) {
      setSelectedTeam(myTeams[0] ?? null);
    }
  }, [myTeams, selectedTeam, setSelectedTeam]);

  const { data: resourceAvailability } = useGetResourceAvailability({
    teams: selectedTeam !== null ? (selectedTeam.teamId as number) : null,
    startDate: startAndEndDates.start,
    endDate: startAndEndDates.end
  });

  useEffect(() => {
    if (selectedDuration === LeaveStates.NONE) {
      const duration = getDurationInitialValue(
        selectedLeaveAllocationData.leaveType.leaveDuration
      );
      setSelectedDuration(duration);
    }
  }, [
    selectedLeaveAllocationData.leaveType.leaveDuration,
    selectedDuration,
    setSelectedDuration
  ]);

  const checkValidationStatus = useCallback(
    () =>
      getApplyLeaveFormValidationErrors({
        selectedDates,
        comment,
        attachments,
        selectedLeaveAllocationData,
        setFormErrors,
        translateText
      }),
    [
      selectedDates,
      comment,
      attachments,
      selectedLeaveAllocationData,
      setFormErrors,
      translateText
    ]
  );

  useEffect(() => {
    if (
      formErrors?.selectedDates ||
      formErrors?.comment ||
      formErrors?.attachment
    ) {
      checkValidationStatus();
    }
  }, [selectedDates, comment, attachments]);

  const onSubmit = () => {
    const isValid = checkValidationStatus();
    if (isValid) {
      const fileNames = attachments.map((attachment) => attachment.name ?? "");

      const payload = {
        typeId: selectedLeaveAllocationData.leaveType.typeId,
        startDate: convertToYYYYMMDDFromDateTime(selectedDates[0]),
        endDate: convertToYYYYMMDDFromDateTime(
          selectedDates[1] ?? selectedDates[0]
        ),
        leaveState: selectedDuration,
        requestDesc: comment,
        attachments: fileNames
      };

      if (attachments && attachments.length > 0) {
        const formData = new FormData();

        attachments.forEach((attachment) => {
          if (attachment.file) {
            formData.append("file", attachment.file);
          }
        });

        formData.append("type", FileTypes.LEAVE_ATTACHMENTS);

        uploadAttachments(formData, {
          onSuccess: () => {
            applyLeaveMutate(payload);
          }
        });
      } else {
        applyLeaveMutate(payload);
      }
    }
  };

  return (
    <Stack sx={classes.wrapper}>
      <Stack sx={classes.formWrapper}>
        <Stack sx={classes.calendarWrapper}>
          <CalendarDateRangePicker
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            setSelectedMonth={setSelectedMonth}
            allowedDuration={
              selectedLeaveAllocationData.leaveType.leaveDuration
            }
            resourceAvailability={resourceAvailability}
            minDate={firstDateOfYear}
            maxDate={lastDateOfYear}
            workingDays={workingDays}
            myLeaveRequests={pendingAndApprovedLeaveRequests}
            error={formErrors?.selectedDates}
          />
          <Stack sx={classes.textWrapper}>
            <Typography variant="body1">
              {translateText(["myEntitlements"], {
                leaveType: selectedLeaveAllocationData.leaveType.name
              }) ?? ""}
            </Typography>
            <LeaveEntitlementBalanceCard
              leaveEntitlementBalance={leaveEntitlementBalance}
            />
          </Stack>
        </Stack>
        <Stack sx={classes.fieldWrapper}>
          {selectedDates.length && myTeams?.length ? (
            <TeamAvailabilityCard
              teams={myTeams}
              resourceAvailability={resourceAvailability}
            />
          ) : (
            <></>
          )}
          <DurationSelector
            label={translateText(["selectDuration"])}
            onChange={(value) => setSelectedDuration(value)}
            options={{
              fullDay: LeaveStates.FULL_DAY,
              halfDayMorning: LeaveStates.MORNING,
              halfDayEvening: LeaveStates.EVENING
            }}
            disabledOptions={getDurationSelectorDisabledOptions({
              selectedDates,
              duration: selectedLeaveAllocationData.leaveType.leaveDuration,
              myLeaveRequests: pendingAndApprovedLeaveRequests,
              resourceAvailability
            })}
            value={selectedDuration}
          />
          <TextArea
            label={translateText(["comment"])}
            placeholder={translateText(["addComment"])}
            isRequired={
              selectedLeaveAllocationData.leaveType.isCommentMandatory
            }
            isAttachmentRequired={
              selectedLeaveAllocationData.leaveType.isAttachmentMandatory
            }
            maxLength={255}
            name="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            iconName={
              selectedLeaveAllocationData.leaveType.isAttachment
                ? IconName.ATTACHMENT_ICON
                : undefined
            }
            onIconClick={() => {
              storageAvailabilityData?.availableSpace >= NINETY_PERCENT
                ? setToastMessage({
                    open: true,
                    toastType: "error",
                    title: translateStorageText(["storageTitle"]),
                    description: translateStorageText(["contactAdminText"]),
                    isIcon: true
                  })
                : setMyLeaveRequestModalType(
                    MyRequestModalEnums.ADD_ATTACHMENT
                  );
            }}
            error={{
              comment: formErrors?.comment,
              attachment: formErrors?.attachment
            }}
          />
          <AttachmentSummary
            attachments={attachments}
            onDeleteBtnClick={(attachment) =>
              setAttachments(attachments.filter((a) => a !== attachment))
            }
          />
          <LeaveSummary
            leaveTypeName={selectedLeaveAllocationData.leaveType.name}
            leaveTypeEmoji={selectedLeaveAllocationData.leaveType.emojiCode}
            leaveDuration={selectedDuration}
            startDate={selectedDates[0]}
            endDate={selectedDates[1]}
            resourceAvailability={resourceAvailability}
            workingDays={workingDays}
          />
        </Stack>
      </Stack>
      <Stack sx={classes.btnWrapper}>
        <Button
          label={translateText(["submitBtn"])}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.TICK_ICON}
          onClick={onSubmit}
          isLoading={isLeaveApplyPending}
        />
        <Button
          label={translateText(["cancelBtn"])}
          buttonStyle={ButtonStyle.TERTIARY}
          endIcon={IconName.CLOSE_ICON}
          onClick={() => setMyLeaveRequestModalType(MyRequestModalEnums.NONE)}
        />
      </Stack>
    </Stack>
  );
};

export default ApplyLeaveModal;

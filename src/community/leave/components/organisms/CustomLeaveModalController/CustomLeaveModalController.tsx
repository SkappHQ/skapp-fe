import { FC, useCallback, useEffect, useState } from "react";

import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { useDeleteLeaveAllocation } from "~community/leave/api/LeaveApi";
import AddLeaveAllocationModal from "~community/leave/components/molecules/CustomLeaveModals/AddLeaveAllocationModal/AddLeaveAllocationModal";
import DeleteConfirmationModal from "~community/leave/components/molecules/CustomLeaveModals/DeleteConfirmModal/DeleteConfirmModal";
import EditLeaveAllocationModal from "~community/leave/components/molecules/CustomLeaveModals/EditLeaveAllocationModal/EditLeaveAllocationModal";
import { useLeaveStore } from "~community/leave/store/store";
import {
  CustomLeaveAllocationModalTypes,
  CustomLeaveAllocationType
} from "~community/leave/types/CustomLeaveAllocationTypes";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";

import UnsavedLeaveAllocationModal from "../UnsavedLeaveAllocationModal/UnsavedLeaveAllocationModal";

const CustomLeaveModalController: FC = () => {
  const translateText = useTranslator("leaveModule", "customLeave");
  const { setToastMessage } = useToast();

  const {
    isLeaveAllocationModalOpen,
    setIsLeaveAllocationModalOpen,
    customLeaveAllocationModalType,
    setCustomLeaveAllocationModalType,
    currentEditingLeaveAllocation,
    setCurrentPage
  } = useLeaveStore((state) => state);

  const [tempLeaveAllocationDetails, setTempLeaveAllocationDetails] = useState<
    CustomLeaveAllocationType | undefined
  >();
  const [currentLeaveAllocationFormData, setCurrentLeaveAllocationFormData] =
    useState<CustomLeaveAllocationType | undefined>();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [previousModalType, setPreviousModalType] =
    useState<CustomLeaveAllocationModalTypes>(
      CustomLeaveAllocationModalTypes.NONE
    );

  const { mutate: deleteLeaveAllocation } = useDeleteLeaveAllocation();

  const isEditingLeaveAllocationChanged = useCallback((): boolean => {
    if (!currentLeaveAllocationFormData || !currentEditingLeaveAllocation) {
      return false;
    }

    return (
      currentLeaveAllocationFormData.employeeId !==
        currentEditingLeaveAllocation.employeeId ||
      currentLeaveAllocationFormData.typeId !==
        currentEditingLeaveAllocation.typeId ||
      currentLeaveAllocationFormData.numberOfDaysOff !==
        currentEditingLeaveAllocation.numberOfDaysOff ||
      currentLeaveAllocationFormData.validFromDate !==
        currentEditingLeaveAllocation.validFromDate ||
      currentLeaveAllocationFormData.validToDate !==
        currentEditingLeaveAllocation.validToDate
    );
  }, [currentLeaveAllocationFormData, currentEditingLeaveAllocation]);

  const hasUnsavedChanges = useCallback((): boolean => {
    if (
      customLeaveAllocationModalType ===
      CustomLeaveAllocationModalTypes.ADD_LEAVE_ALLOCATION
    ) {
      return !!(
        currentLeaveAllocationFormData?.employeeId ||
        currentLeaveAllocationFormData?.typeId ||
        currentLeaveAllocationFormData?.numberOfDaysOff ||
        currentLeaveAllocationFormData?.validFromDate ||
        currentLeaveAllocationFormData?.validToDate
      );
    }
    return isEditingLeaveAllocationChanged();
  }, [
    customLeaveAllocationModalType,
    currentLeaveAllocationFormData,
    isEditingLeaveAllocationChanged
  ]);

  const handleCloseModal = useCallback((): void => {
    if (hasUnsavedChanges()) {
      setPreviousModalType(customLeaveAllocationModalType);
      setTempLeaveAllocationDetails(currentLeaveAllocationFormData);
      setCustomLeaveAllocationModalType(
        CustomLeaveAllocationModalTypes.UNSAVED_ADD_LEAVE_ALLOCATION
      );
    } else {
      setIsLeaveAllocationModalOpen(false);
      setCustomLeaveAllocationModalType(CustomLeaveAllocationModalTypes.NONE);
      setCurrentLeaveAllocationFormData(undefined);
      setTempLeaveAllocationDetails(undefined);
    }
  }, [
    hasUnsavedChanges,
    customLeaveAllocationModalType,
    currentLeaveAllocationFormData,
    setCustomLeaveAllocationModalType,
    setIsLeaveAllocationModalOpen
  ]);

  const handleDelete = useCallback(() => {
    setIsDeleteConfirmationOpen(true);
    setIsLeaveAllocationModalOpen(false);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteConfirmationOpen(false);
    setIsLeaveAllocationModalOpen(true);
  }, []);

  const { sendEvent } = useGoogleAnalyticsEvent();

  const handleDeleteConfirm = useCallback(() => {
    if (currentEditingLeaveAllocation?.entitlementId) {
      deleteLeaveAllocation(currentEditingLeaveAllocation.entitlementId, {
        onSuccess: () => {
          setIsDeleteConfirmationOpen(false);
          setCustomLeaveAllocationModalType(
            CustomLeaveAllocationModalTypes.NONE
          );
          setToastMessage({
            open: true,
            toastType: ToastType.SUCCESS,
            title: translateText(["deleteSuccessTitle"]),
            description: translateText(["deleteSuccessDescription"]),
            isIcon: true
          });
          setCurrentPage(0);
          sendEvent(GoogleAnalyticsTypes.GA4_CUSTOM_ALLOCATION_DELETED);
        },
        onError: () => {
          setToastMessage({
            open: true,
            toastType: ToastType.ERROR,
            title: translateText(["deleteFailToastTitle"]),
            description: translateText(["deleteFailDescription"]),
            isIcon: true
          });
        }
      });
    }
  }, [currentEditingLeaveAllocation, deleteLeaveAllocation, setToastMessage]);

  const handleCancelLeaveAllocation = useCallback(
    (values: CustomLeaveAllocationType): void => {
      if (hasUnsavedChanges()) {
        setPreviousModalType(customLeaveAllocationModalType);
        setTempLeaveAllocationDetails(values);
        setCustomLeaveAllocationModalType(
          CustomLeaveAllocationModalTypes.UNSAVED_ADD_LEAVE_ALLOCATION
        );
      } else {
        setIsLeaveAllocationModalOpen(false);
        setCustomLeaveAllocationModalType(CustomLeaveAllocationModalTypes.NONE);
        setCurrentLeaveAllocationFormData(undefined);
        setTempLeaveAllocationDetails(undefined);
      }
    },
    [
      hasUnsavedChanges,
      customLeaveAllocationModalType,
      setCustomLeaveAllocationModalType,
      setIsLeaveAllocationModalOpen,
      setTempLeaveAllocationDetails,
      setCurrentLeaveAllocationFormData
    ]
  );

  const getModalTitle = useCallback((): string => {
    switch (customLeaveAllocationModalType) {
      case CustomLeaveAllocationModalTypes.ADD_LEAVE_ALLOCATION:
        return translateText(["addLeaveAllocationModalTitle"]);
      case CustomLeaveAllocationModalTypes.EDIT_LEAVE_ALLOCATION:
        return translateText(["editLeaveAllocationModalTitle"]);
      case CustomLeaveAllocationModalTypes.UNSAVED_ADD_LEAVE_ALLOCATION:
        return translateText(["unsavedAddLeaveAllocationModalTitle"]);
      default:
        return "";
    }
  }, [customLeaveAllocationModalType, translateText]);

  useEffect(() => {
    if (!isLeaveAllocationModalOpen) {
      setCurrentLeaveAllocationFormData(undefined);
      setTempLeaveAllocationDetails(undefined);
      setPreviousModalType(CustomLeaveAllocationModalTypes.NONE);
    }
  }, [isLeaveAllocationModalOpen]);

  const handleResumeEdit = useCallback(() => {
    setCustomLeaveAllocationModalType(previousModalType);
    setCurrentLeaveAllocationFormData(tempLeaveAllocationDetails);
  }, [
    previousModalType,
    tempLeaveAllocationDetails,
    setCustomLeaveAllocationModalType
  ]);

  return (
    <>
      <ModalController
        isModalOpen={isLeaveAllocationModalOpen}
        handleCloseModal={handleCloseModal}
        modalTitle={getModalTitle()}
        isClosable={
          customLeaveAllocationModalType !==
          CustomLeaveAllocationModalTypes.UNSAVED_ADD_LEAVE_ALLOCATION
        }
      >
        <>
          {customLeaveAllocationModalType ===
            CustomLeaveAllocationModalTypes.ADD_LEAVE_ALLOCATION && (
            <AddLeaveAllocationModal
              setTempLeaveAllocationDetails={setTempLeaveAllocationDetails}
              setCurrentLeaveAllocationFormData={
                setCurrentLeaveAllocationFormData
              }
              isEditingLeaveAllocationChanged={hasUnsavedChanges()}
              initialValues={
                tempLeaveAllocationDetails || ({} as CustomLeaveAllocationType)
              }
              onCancel={handleCancelLeaveAllocation}
            />
          )}
          {customLeaveAllocationModalType ===
            CustomLeaveAllocationModalTypes.EDIT_LEAVE_ALLOCATION && (
            <EditLeaveAllocationModal
              setCurrentLeaveAllocationFormData={
                setCurrentLeaveAllocationFormData
              }
              onDelete={handleDelete}
              initialValues={
                tempLeaveAllocationDetails || ({} as CustomLeaveAllocationType)
              }
            />
          )}
          {customLeaveAllocationModalType ===
            CustomLeaveAllocationModalTypes.UNSAVED_ADD_LEAVE_ALLOCATION && (
            <UnsavedLeaveAllocationModal
              setTempLeaveAllocationDetails={setTempLeaveAllocationDetails}
              onResume={handleResumeEdit}
            />
          )}
        </>
      </ModalController>

      <DeleteConfirmationModal
        open={isDeleteConfirmationOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={translateText(["deleteLeaveAllocationModalTitle"])}
        content={translateText(["deleteLeaveAllocationModalDescription"])}
      />
    </>
  );
};

export default CustomLeaveModalController;

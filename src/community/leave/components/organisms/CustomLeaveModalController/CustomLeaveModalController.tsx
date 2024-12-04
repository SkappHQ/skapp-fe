import { FC, useCallback, useEffect, useState } from "react";

import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { useTranslator } from "~community/common/hooks/useTranslator";
import AddLeaveAllocationModal from "~community/leave/components/molecules/CustomLeaveModals/AddLeaveAllocationModal/AddLeaveAllocationModal";
import DeleteConfirmationModal from "~community/leave/components/molecules/CustomLeaveModals/DeleteConfirmModal/DeleteConfirmModal";
import EditLeaveAllocationModal from "~community/leave/components/molecules/CustomLeaveModals/EditLeaveAllocationModal/EditLeaveAllocationModal";
import { useLeaveStore } from "~community/leave/store/store";
import {
  CustomLeaveAllocationModalTypes,
  CustomLeaveAllocationType
} from "~community/leave/types/CustomLeaveAllocationTypes";

import UnsavedLeaveAllocationModal from "../UnsavedLeaveAllocationModal/UnsavedLeaveAllocationModal";

const CustomLeaveModalController: FC = () => {
  const translateText = useTranslator("leaveModule", "customLeave");

  const {
    isLeaveAllocationModalOpen,
    setIsLeaveAllocationModalOpen,
    customLeaveAllocationModalType,
    setCustomLeaveAllocationModalType,
    currentEditingLeaveAllocation
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

  const handleDelete = useCallback((): void => {
    setIsDeleteConfirmationOpen(true);
  }, []);

  const handleConfirmDelete = useCallback((): void => {
    setIsLeaveAllocationModalOpen(false);
    setCustomLeaveAllocationModalType(CustomLeaveAllocationModalTypes.NONE);
    setIsDeleteConfirmationOpen(false);
    setCurrentLeaveAllocationFormData(undefined);
    setTempLeaveAllocationDetails(undefined);
  }, [setIsLeaveAllocationModalOpen, setCustomLeaveAllocationModalType]);

  const handleCancelDelete = useCallback((): void => {
    setIsDeleteConfirmationOpen(false);
  }, []);

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
        <DeleteConfirmationModal
          open={isDeleteConfirmationOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={translateText(["deleteLeaveAllocationModalTitle"])}
          content={translateText(["deleteLeaveAllocationModalDescription"])}
        />
      </>
    </ModalController>
  );
};

export default CustomLeaveModalController;

import { Box } from "@mui/material";
import { useFormik } from "formik";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import {
  useDeleteLeaveAllocation,
  useUpdateLeaveAllocation
} from "~community/leave/api/LeaveApi";
import { useLeaveStore } from "~community/leave/store/store";
import {
  CustomLeaveAllocationModalTypes,
  CustomLeaveAllocationType
} from "~community/leave/types/CustomLeaveAllocationTypes";
import { customLeaveAllocationValidation } from "~community/leave/utils/validations";

import CustomLeaveAllocationForm from "../../CustomLeaveAllocationForm/CustomLeaveAllocationForm";
import DeleteConfirmationModal from "../DeleteConfirmModal/DeleteConfirmModal";

interface Props {
  setCurrentLeaveAllocationFormData: Dispatch<
    SetStateAction<CustomLeaveAllocationType | undefined>
  >;
  onDelete: () => void;
  initialValues: CustomLeaveAllocationType;
}

const EditLeaveAllocationModal: React.FC<Props> = ({
  setCurrentLeaveAllocationFormData,
  initialValues
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const translateText = useTranslator("leaveModule", "customLeave");

  const { setToastMessage } = useToast();

  const {
    setCustomLeaveAllocationModalType,
    setIsLeaveAllocationModalOpen,
    currentEditingLeaveAllocation
  } = useLeaveStore((state) => ({
    setCustomLeaveAllocationModalType: state.setCustomLeaveAllocationModalType,
    setIsLeaveAllocationModalOpen: state.setIsLeaveAllocationModalOpen,
    currentEditingLeaveAllocation: state.currentEditingLeaveAllocation
  }));

  const onUpdateSuccess = useCallback(() => {
    setIsLeaveAllocationModalOpen(false);
    setCustomLeaveAllocationModalType(
      CustomLeaveAllocationModalTypes.EDIT_LEAVE_ALLOCATION
    );
    setToastMessage({
      open: true,
      toastType: "success",
      title: translateText(["updateSuccessTitle"]),
      description: translateText(["updateSuccessDescription"]),
      isIcon: true
    });
  }, [setIsLeaveAllocationModalOpen, setCustomLeaveAllocationModalType]);

  const updateLeaveAllocationMutation = useUpdateLeaveAllocation();
  const deleteLeaveAllocation = useDeleteLeaveAllocation();

  const onSubmit = useCallback(
    (values: CustomLeaveAllocationType) => {
      updateLeaveAllocationMutation.mutate(
        {
          employeeId: currentEditingLeaveAllocation?.employeeId ?? 0,
          typeId: Number(values.typeId),
          numberOfDaysOff: Number(values.numberOfDaysOff),
          entitlementId: currentEditingLeaveAllocation?.entitlementId
            ? Number(currentEditingLeaveAllocation.entitlementId)
            : 0,
          validFromDate: values?.validFromDate,
          validToDate: values?.validToDate
        },
        {
          onSuccess: onUpdateSuccess
        }
      );
    },
    [
      updateLeaveAllocationMutation,
      currentEditingLeaveAllocation,
      onUpdateSuccess
    ]
  );

  const onDelete = useCallback(() => {
    if (!currentEditingLeaveAllocation?.entitlementId) {
      setToastMessage({
        open: true,
        toastType: "error",
        title: translateText(["deleteErrorTitle"]),
        description: translateText(["deleteErrorDescription"]),
        isIcon: true
      });
      return;
    }

    deleteLeaveAllocation.mutate(currentEditingLeaveAllocation.entitlementId, {
      onSuccess: () => {
        setIsLeaveAllocationModalOpen(false);
        setToastMessage({
          open: true,
          toastType: "success",
          title: translateText(["deleteSuccessTitle"]),
          description: translateText(["deleteSuccessDescription"]),
          isIcon: true
        });
      },
      onError: () => {
        setToastMessage({
          open: true,
          toastType: "error",
          title: translateText(["deleteFailToastTitle"]),
          description: translateText(["deleteFailDescription"]),
          isIcon: true
        });
      }
    });
  }, [
    deleteLeaveAllocation,
    currentEditingLeaveAllocation,
    setIsLeaveAllocationModalOpen,
    setToastMessage,
    translateText
  ]);

  const form = useFormik({
    initialValues: {
      assignedTo:
        currentEditingLeaveAllocation?.assignedTo || initialValues.assignedTo,
      entitlementId: currentEditingLeaveAllocation?.entitlementId
        ? Number(currentEditingLeaveAllocation.entitlementId)
        : Number(initialValues.entitlementId),
      employeeId: currentEditingLeaveAllocation?.employeeId
        ? Number(currentEditingLeaveAllocation.employeeId)
        : Number(initialValues.employeeId),
      typeId: currentEditingLeaveAllocation?.typeId
        ? Number(currentEditingLeaveAllocation.typeId)
        : Number(initialValues.typeId),
      numberOfDaysOff: currentEditingLeaveAllocation?.numberOfDaysOff
        ? Number(currentEditingLeaveAllocation.numberOfDaysOff)
        : Number(initialValues.numberOfDaysOff),
      validToDate:
        currentEditingLeaveAllocation?.validToDate || initialValues.validToDate,
      validFromDate:
        currentEditingLeaveAllocation?.validFromDate ||
        initialValues.validFromDate
    },
    validationSchema: customLeaveAllocationValidation(translateText),
    onSubmit,
    enableReinitialize: true
  });
  const {
    values,
    errors,
    handleSubmit,
    setFieldValue,
    setFieldError,
    isSubmitting
  } = form;

  const handleDelete = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  useEffect(() => {
    setCurrentLeaveAllocationFormData(values);
  }, [values, setCurrentLeaveAllocationFormData]);

  const isDeleteDisabled = currentEditingLeaveAllocation?.totalDaysUsed != 0;
  const isSaveDisabled =
    !values.employeeId ||
    !values.typeId ||
    !values.numberOfDaysOff ||
    isSubmitting;

  return (
    <>
      <CustomLeaveAllocationForm
        values={values}
        errors={errors}
        setFieldValue={setFieldValue}
        setFieldError={setFieldError}
        translateText={translateText}
        onSubmit={handleSubmit}
      />
      <Box sx={{ mt: "1rem" }}>
        <Button
          label={translateText(["saveChangesBtn"])}
          styles={{ mt: "1rem" }}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
          onClick={() => onSubmit(values)}
          disabled={isSaveDisabled}
        />
        <Button
          label={translateText(["deleteBtnText"])}
          styles={{ mt: "1rem" }}
          buttonStyle={ButtonStyle.ERROR}
          endIcon={<Icon name={IconName.DELETE_BUTTON_ICON} />}
          onClick={handleDelete}
          disabled={isDeleteDisabled}
        />
      </Box>
      <DeleteConfirmationModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={onDelete}
        title={translateText(["deleteLeaveAllocationModalTitle"])}
        content={translateText(["deleteLeaveAllocationModalDescription"])}
      />
    </>
  );
};

export default EditLeaveAllocationModal;

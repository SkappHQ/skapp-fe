import { Box } from "@mui/material";
import { useFormik } from "formik";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo
} from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useCreateLeaveAllocation } from "~community/leave/api/LeaveApi";
import { useLeaveStore } from "~community/leave/store/store";
import {
  CustomLeaveAllocationModalTypes,
  CustomLeaveAllocationType
} from "~community/leave/types/CustomLeaveAllocationTypes";
import { customLeaveAllocationValidation } from "~community/leave/utils/validations";

import CustomLeaveAllocationForm from "../../CustomLeaveAllocationForm/CustomLeaveAllocationForm";

interface Props {
  setTempLeaveAllocationDetails: Dispatch<
    SetStateAction<CustomLeaveAllocationType | undefined>
  >;
  setCurrentLeaveAllocationFormData: Dispatch<
    SetStateAction<CustomLeaveAllocationType | undefined>
  >;
  isEditingLeaveAllocationChanged: boolean;
  initialValues: CustomLeaveAllocationType;
  onCancel: (values: CustomLeaveAllocationType) => void;
}
const AddLeaveAllocationModal: React.FC<Props> = ({
  setCurrentLeaveAllocationFormData,
  initialValues,
  onCancel
}) => {
  const translateText = useTranslator("leaveModule", "customLeave");
  const { setCustomLeaveAllocationModalType, setIsLeaveAllocationModalOpen } =
    useLeaveStore();

  const { setToastMessage } = useToast();

  const onAddSuccess = useCallback(() => {
    setIsLeaveAllocationModalOpen(false);
    setCustomLeaveAllocationModalType(
      CustomLeaveAllocationModalTypes.ADD_LEAVE_ALLOCATION
    );
    setToastMessage({
      open: true,
      toastType: "success",
      title: translateText(["customLeaveAllocationSuccessTitle"]),
      description: translateText(["customLeaveAllocationSuccessDes"]),
      isIcon: true
    });
  }, [setIsLeaveAllocationModalOpen, setCustomLeaveAllocationModalType]);

  const onAddError = useCallback(() => {
    setToastMessage({
      open: true,
      toastType: "error",
      title: translateText(["customLeaveAllocationFailTitle"]),
      description: translateText(["customLeaveAllocationFailDes"]),
      isIcon: true
    });
  }, []);

  const { mutate, isPending } = useCreateLeaveAllocation(
    onAddSuccess,
    onAddError
  );

  const onSubmit = useCallback(
    (values: CustomLeaveAllocationType) => {
      mutate(values, {
        onSuccess: onAddSuccess,
        onError: onAddError
      });
    },
    [mutate, onAddSuccess, onAddError]
  );

  const validationSchema = useMemo(
    () => customLeaveAllocationValidation(translateText),
    [translateText]
  );

  const form = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
    validateOnChange: false
  });

  const {
    values,
    errors,
    handleSubmit,
    setFieldValue,
    setFieldError,
    isSubmitting
  } = form;

  useEffect(() => {
    setCurrentLeaveAllocationFormData(values);
  }, [values, setCurrentLeaveAllocationFormData]);

  const isSaveDisabled =
    !values.employeeId ||
    !values.typeId ||
    !values.numberOfDaysOff ||
    isPending;

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
          label={translateText(["saveBtn"])}
          styles={{ mt: "1rem" }}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
          onClick={() => onSubmit(values)}
          disabled={isSaveDisabled}
        />
        <Button
          label={translateText(["cancelBtn"])}
          styles={{ mt: "1rem" }}
          buttonStyle={ButtonStyle.TERTIARY}
          endIcon={<Icon name={IconName.CLOSE_ICON} />}
          onClick={() => onCancel(values)}
        />
      </Box>
    </>
  );
};

export default AddLeaveAllocationModal;

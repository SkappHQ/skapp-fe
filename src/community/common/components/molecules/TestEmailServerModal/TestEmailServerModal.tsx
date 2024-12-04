import { Stack } from "@mui/material";
import { useFormik } from "formik";
import React from "react";

import { useTestEmailServer } from "~community/common/api/settingsApi";
import Form from "~community/common/components/molecules/Form/Form";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { characterLengths } from "~community/common/constants/stringConstants";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { testEmailValidation } from "~community/common/utils/validation";

import Button from "../../atoms/Button/Button";
import Icon from "../../atoms/Icon/Icon";
import Modal from "../../organisms/Modal/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TestEmailServerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const translateText = useTranslator("settings");
  const { setToastMessage } = useToast();
  const validationSchema = testEmailValidation(translateText);

  const onSuccess = () => {
    setToastMessage({
      open: true,
      toastType: "success",
      title: translateText(["emailSentSuccessTitle"]),
      description: translateText(["emailSentSuccessDescription"]),
      isIcon: true
    });
    onClose();
  };

  const { mutate: testEmail } = useTestEmailServer(onSuccess);

  const formik = useFormik({
    initialValues: {
      email: "",
      subject: "",
      body: ""
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        setStatus(null);
        testEmail(values);
        setStatus({ success: translateText(["testEmailSentSuccess"]) });
      } catch {
        setStatus({ error: translateText(["testEmailSentError"]) });
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    formik.setFieldError(name, "");
    formik.setStatus(null);
    formik.handleChange(event);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={handleClose}
      title={translateText(["testEmailServerButtonText"])}
      icon={<Icon name={IconName.CLOSE_STATUS_POPUP_ICON} />}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Stack sx={{ gap: "1rem", mt: "0.5rem" }}>
          <InputField
            label={translateText(["recipientEmailAddressText"])}
            inputName="email"
            inputType="text"
            value={formik.values.email}
            placeHolder={translateText(["recipientEmailAddressPlaceholder"])}
            onChange={handleChange}
            required
            error={formik.touched.email ? formik.errors.email : ""}
            isDisabled={formik.isSubmitting}
            inputProps={{
              maxLength: characterLengths.ORGANIZATION_NAME_LENGTH
            }}
          />
          <InputField
            label={translateText(["emailSubjectText"])}
            inputName="subject"
            inputType="text"
            value={formik.values.subject}
            placeHolder={translateText(["emailSubjectPlaceholder"])}
            onChange={handleChange}
            error={formik.touched.subject ? formik.errors.subject : ""}
            isDisabled={formik.isSubmitting}
          />
          <InputField
            label={translateText(["emailBodyText"])}
            inputName="body"
            inputType="text"
            value={formik.values.body}
            placeHolder={translateText(["emailBodyPlaceholder"])}
            onChange={handleChange}
            error={formik.touched.body ? formik.errors.body : ""}
            isDisabled={formik.isSubmitting}
          />

          <Button
            label={translateText(["sendEmailButtonText"])}
            buttonStyle={ButtonStyle.PRIMARY}
            endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
            disabled={formik.isSubmitting}
            onClick={formik.submitForm}
          />
          <Button
            label={translateText(["cancelBtnText"])}
            buttonStyle={ButtonStyle.TERTIARY}
            endIcon={<Icon name={IconName.CLOSE_ICON} />}
            disabled={formik.isSubmitting}
            onClick={handleClose}
          />
        </Stack>
      </Form>
    </Modal>
  );
};

export default TestEmailServerModal;

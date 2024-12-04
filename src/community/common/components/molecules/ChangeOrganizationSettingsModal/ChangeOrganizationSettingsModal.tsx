import { Stack } from "@mui/material";
import { useFormik } from "formik";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";

import { useGetOrganization } from "~community/common/api/OrganizationCreateApi";
import { useUpdateOrganizationDetails } from "~community/common/api/settingsApi";
import DropdownSearch from "~community/common/components/molecules/DropDownSearch/DropDownSearch";
import Form from "~community/common/components/molecules/Form/Form";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { characterLengths } from "~community/common/constants/stringConstants";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { organizationSetupValidation } from "~community/common/utils/validation";
import useGetCountryList from "~community/people/hooks/useGetCountryList";

import Button from "../../atoms/Button/Button";
import Icon from "../../atoms/Icon/Icon";
import Modal from "../../organisms/Modal/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeOrganizationSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose
}) => {
  const translateText = useTranslator("settings");

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const onBoardingTranslateText = useTranslator(
    "onboarding",
    "organizationCreate"
  );

  const { data: organizationDetails } = useGetOrganization();

  const { setToastMessage } = useToast();

  const [initialValues, setInitialValues] = useState({
    organizationName: "",
    organizationWebsite: "",
    country: ""
  });

  useEffect(() => {
    if (organizationDetails?.results[0]) {
      setInitialValues({
        organizationName: organizationDetails.results[0].organizationName || "",
        organizationWebsite:
          organizationDetails.results[0].organizationWebsite || "",
        country: organizationDetails.results[0].country || ""
      });
      setIsInitialLoadComplete(true);
    }
  }, [organizationDetails]);

  const onSuccess = () => {
    setToastMessage({
      open: true,
      toastType: "success",
      title: translateText(["organizationDetailsUpdateSuccessTitle"]),
      description: translateText([
        "organizationDetailsUpdateSuccessDescription"
      ]),
      isIcon: true
    });
    onClose();
  };

  const { mutate: updateOrganizationDetails } =
    useUpdateOrganizationDetails(onSuccess);

  const countryList = useGetCountryList();
  const onSubmit = async (values: typeof initialValues) => {
    updateOrganizationDetails(values);
  };

  const OrganisationForm = useFormik({
    initialValues,
    validationSchema: organizationSetupValidation(onBoardingTranslateText),
    onSubmit,
    validateOnChange: false,
    enableReinitialize: true
  });

  const { values, errors, handleChange, handleSubmit } = OrganisationForm;

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target) {
        OrganisationForm.setFieldError(event.target.name, "");
      }
    },
    [OrganisationForm]
  );

  const handleCountrySelect = async (newValue: string): Promise<void> => {
    OrganisationForm.setFieldError("country", "");
    await OrganisationForm.setFieldValue("country", newValue);
  };

  const handleCancel = () => {
    OrganisationForm.resetForm();
    onClose();
  };

  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={handleCancel}
      title={translateText(["organizationDetailsButtonText"])}
      icon={<Icon name={IconName.CLOSE_STATUS_POPUP_ICON} />}
    >
      <Form onSubmit={handleSubmit}>
        <Stack sx={{ mt: "0.4rem", gap: "0.6rem" }}>
          <InputField
            label={translateText(["companyName"])}
            inputName="organizationName"
            inputType="text"
            required
            value={values.organizationName}
            placeHolder="Enter company name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
            }}
            onInput={handleInput}
            error={errors.organizationName ?? ""}
            isDisabled={false}
            inputProps={{
              maxLength: characterLengths.ORGANIZATION_NAME_LENGTH
            }}
          />
          <InputField
            label={translateText(["companyWebsite"])}
            inputName="organizationWebsite"
            inputType="text"
            value={values.organizationWebsite}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
            }}
            placeHolder="Enter company website"
            onInput={handleInput}
            error={errors.organizationWebsite ?? ""}
          />
          <DropdownSearch
            label={translateText(["country"])}
            inputName={"country"}
            itemList={countryList}
            value={values.country}
            error={errors.country ?? ""}
            placeholder={"Select Country"}
            required={true}
            onChange={(value) => {
              handleCountrySelect(value as string);
            }}
            componentStyle={{ mt: "0rem" }}
          />
          <Button
            label={translateText(["saveChangesBtnText"])}
            styles={{ mt: "1rem" }}
            buttonStyle={ButtonStyle.PRIMARY}
            endIcon={IconName.RIGHT_ARROW_ICON}
            disabled={!isInitialLoadComplete || !OrganisationForm.dirty}
            onClick={() => handleSubmit()}
          />
          <Button
            label={translateText(["cancelBtnText"])}
            styles={{ mt: "0.4rem" }}
            buttonStyle={ButtonStyle.TERTIARY}
            endIcon={IconName.CLOSE_ICON}
            disabled={false}
            onClick={handleCancel}
          />
        </Stack>
      </Form>
    </Modal>
  );
};
export default ChangeOrganizationSettingsModal;

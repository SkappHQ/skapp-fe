import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";

import Checkbox from "~community/common/components/atoms/Checkbox/Checkbox";
import Form from "~community/common/components/molecules/Form/Form";
import InputField from "~community/common/components/molecules/InputField/InputField";
import PasswordStrengthMeter from "~community/common/components/molecules/PasswordStrengthMeter/PasswordStrengthMeter";
import { characterLengths } from "~community/common/constants/stringConstants";
import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  emailValidation,
  nameValidation
} from "~enterprise/common/utils/validations";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignUpFormProps {
  formValues: FormValues;
  errors?: { [key: string]: string };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  formValues,
  errors = {},
  onInputChange,
  handleInput
}) => {
  const translateText = useTranslator("onboarding", "organizationCreate");
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const togglePasswordVisibility = (
    field: keyof typeof passwordVisibility,
    isVisible: boolean
  ) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: isVisible
    }));
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return nameValidation.validate(value);
      case "email":
        return emailValidation.validate(value);
      default:
        return null;
    }
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    onInputChange({
      ...e,
      target: {
        ...e.target,
        validationError: error
      }
    });
  };

  const getErrorMessage = (field: keyof FormValues) => errors?.[field] || "";

  return (
    <Box sx={{ width: "39.1875rem" }}>
      <Form>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: "1rem",
            width: "100%",
            marginBottom: "1.5rem"
          }}
        >
          <InputField
            label={translateText(["firstNameLabel"])}
            inputType="text"
            inputName="firstName"
            required={true}
            value={formValues.firstName}
            placeHolder={translateText(["firstNamePlaceholder"])}
            onChange={handleFieldChange}
            onInput={handleInput}
            error={getErrorMessage("firstName")}
            inputProps={{
              maxLength: nameValidation.maxLength,
              pattern: nameValidation.pattern.source
            }}
          />
          <InputField
            label={translateText(["lastNameLabel"])}
            inputName="lastName"
            inputType="text"
            required
            value={formValues.lastName}
            onChange={handleFieldChange}
            placeHolder={translateText(["lastNamePlaceholder"])}
            onInput={handleInput}
            error={getErrorMessage("lastName")}
            inputProps={{
              maxLength: nameValidation.maxLength,
              pattern: nameValidation.pattern.source
            }}
          />
        </Box>

        <Box sx={{ marginBottom: "1.5rem", width: "100%" }}>
          <InputField
            label={translateText(["emailLabel"])}
            inputName="email"
            inputType="text"
            required
            value={formValues.email}
            placeHolder={translateText(["emailPlaceholder"])}
            onChange={handleFieldChange}
            onInput={handleInput}
            error={getErrorMessage("email")}
            inputProps={{
              maxLength: emailValidation.maxLength,
              pattern: emailValidation.pattern.source
            }}
          />
        </Box>

        <Box sx={{ marginBottom: "1.5rem", width: "100%" }}>
          <InputField
            label={translateText(["passwordLabel"])}
            inputName="password"
            required
            inputType={passwordVisibility.password ? "text" : "password"}
            value={formValues.password}
            placeHolder={translateText(["passwordPlaceholder"])}
            onChange={onInputChange}
            onInput={handleInput}
            error={getErrorMessage("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  sx={{ p: "1rem" }}
                  onMouseDown={() => togglePasswordVisibility("password", true)}
                  onMouseUp={() => togglePasswordVisibility("password", false)}
                  onMouseLeave={() =>
                    togglePasswordVisibility("password", false)
                  }
                >
                  {passwordVisibility.password ? (
                    <Visibility />
                  ) : (
                    <VisibilityOff />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>

        {formValues.password.length > 0 && (
          <Box sx={{ width: "100%" }}>
            <PasswordStrengthMeter password={formValues.password} />
          </Box>
        )}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              name="terms"
            />
            <Typography
              variant="body2"
              sx={{
                lineHeight: 3,
                display: "flex",
                alignItems: "center"
              }}
            >
              {translateText(["termsAndConditionsInitial"])}
              <Link
                href="/terms-and-conditions"
                style={{
                  color: "primary.main",
                  textDecoration: "underline",
                  marginLeft: "0.25rem"
                }}
              >
                {translateText(["termsAndConditionsLink"])}
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <Checkbox
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              name="privacy"
            />
            <Typography
              variant="body2"
              sx={{
                lineHeight: 3,
                display: "flex",
                alignItems: "center"
              }}
            >
              {translateText(["privacyPolicyInitial"])}
              <Link
                href="/privacy-policy"
                style={{
                  color: "primary.main",
                  textDecoration: "underline",
                  marginLeft: "0.25rem"
                }}
              >
                {translateText(["privacyPolicyLink"])}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Form>
    </Box>
  );
};

export default SignUpForm;

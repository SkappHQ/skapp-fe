import { Box, Stack, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import React, { useEffect, useState } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { theme } from "~community/common/theme/theme";

import OTPInput from "../OTPInput/OTPInput";

interface OTPFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onSubmit: (otp: string) => void;
  onResendCode: () => Promise<void>;
}

const OTPField: React.FC<OTPFieldProps> = ({
  value,
  onChange,
  error,
  onSubmit,
  onResendCode
}) => {
  const [activeInput, setActiveInput] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputCount = 6;
  const translateText = useTranslator("onboarding", "organizationCreate");

  useEffect(() => {
    if (value.length === inputCount) {
      onSubmit(value);
    }
  }, [value, onSubmit]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isResendDisabled && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (countdown === 0) {
      setIsResendDisabled(false);
      setCountdown(30);
    }
    return () => clearInterval(intervalId);
  }, [countdown, isResendDisabled]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = e.target.value;
    if (isNaN(Number(newValue))) return;

    const newOtp = value.split("");
    newOtp[index] = newValue;
    onChange(newOtp.join(""));

    if (newValue && index < inputCount - 1) {
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      setActiveInput(index - 1);
    }
  };

  const handleResendCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isResendDisabled) {
      try {
        await onResendCode();
        setIsResendDisabled(true);
      } catch (error) {
        console.error("Failed to resend code:", error);
      }
    }
  };

  return (
    <Box sx={{ width: "39.1875rem" }}>
      <Typography variant="body1">Verification code</Typography>

      <Stack direction="row" spacing={2} sx={{ marginBottom: "0.75rem" }}>
        {Array(inputCount)
          .fill(null)
          .map((_, index) => (
            <OTPInput
              key={index}
              index={index}
              focus={index === activeInput}
              value={value[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setActiveInput(index)}
            />
          ))}
      </Stack>

      {error && (
        <Typography
          color="error"
          variant="caption"
          sx={{ marginBottom: "1.5rem", display: "block" }}
        >
          {error}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "2.5rem"
        }}
      >
        <Box sx={{ flex: 1 }}>
          {isResendDisabled && (
            <Typography variant="body2">
              {translateText(["resendCountdownText"]).replace(
                "{countdown}",
                countdown.toString()
              )}
            </Typography>
          )}
        </Box>

        <Box sx={{ textAlign: "right" }}>
          {!isResendDisabled && (
            <Link
              href="#"
              onClick={handleResendCode}
              sx={{
                minWidth: "12rem",
                cursor: "pointer",
                textDecoration: "underline",
                color: theme.palette.primary.dark
              }}
            >
              {translateText(["resetCodeBtnText"])}
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OTPField;

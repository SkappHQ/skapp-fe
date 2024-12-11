import { Box } from "@mui/material";
import React, { useState } from "react";

import OTPField from "../OTPField/OTPField";

interface VerifyAccountProps {
  onResendEmail: () => Promise<void>;
  onVerify: (code: string) => Promise<void>;
}

const VerifyAccount: React.FC<VerifyAccountProps> = ({
  onResendEmail,
  onVerify
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [verificationInProgress, setVerificationInProgress] = useState(false);

  const handleOtpChange = (value: string) => {
    if (error) {
      setError("");
    }
    setOtp(value);

    if (value.length === 6) {
      handleSubmit(value);
    }
  };

  const handleSubmit = async (code: string) => {
    if (verificationInProgress) return;

    setVerificationInProgress(true);
    try {
      await onVerify(code);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
      setOtp("");
    } finally {
      setVerificationInProgress(false);
    }
  };

  const handleResendCode = async () => {
    if (!isResending) {
      setIsResending(true);
      try {
        await onResendEmail();
      } catch (err: any) {
        setError(
          err.message || "Failed to resend code. Please try again later."
        );
      } finally {
        setIsResending(false);
      }
    }
  };

  return (
    <Box sx={{ width: "39.1875rem" }}>
      <OTPField
        value={otp}
        onChange={handleOtpChange}
        error={error}
        onSubmit={handleSubmit}
        onResendCode={handleResendCode}
        disabled={verificationInProgress}
      />
    </Box>
  );
};

export default VerifyAccount;

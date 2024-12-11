import React from "react";

import InputField from "~community/common/components/molecules/InputField/InputField";

interface OTPInputProps {
  index: number;
  focus: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  index,
  focus,
  value,
  onChange,
  onKeyDown,
  onFocus
}) => {
  return (
    <InputField
      focusOnText={focus}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      inputName={`otp-${index}`}
      inputMode="numeric"
      inputStyle={{
        width: "5.917rem",
        height: "6.25rem"
      }}
      inputBaseStyle={{
        textAlign: "center",
        fontSize: "2rem",
        lineHeight: "6.25rem",
        padding: 0
      }}
      inputProps={{
        maxLength: 1,
        pattern: "[0-9]*",
        style: {
          textAlign: "center"
        }
      }}
      data-testid={`otp-input-${index}`}
    />
  );
};

export default OTPInput;

import { Stack, type SxProps, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { type ChangeEvent, FC } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { numberPattern } from "~community/common/regex/regexPatterns";

import InputField from "../InputField/InputField";

interface Props {
  label: string;
  countryCodeValue: string;
  placeHolder?: string;
  value: string;
  onChangeCountry?: (countryCode: string) => Promise<void>;
  onChange?: (phone: ChangeEvent<HTMLInputElement>) => Promise<void>;
  error?: string;
  tooltip?: string;
  inputName: string;
  componentStyle?: SxProps;
  required?: boolean;
  fullComponentStyle?: SxProps;
  inputStyle?: SxProps;
  isDisabled?: boolean;
  readOnly?: boolean;
}
const InputPhoneNumber: FC<Props> = ({
  label,
  value,
  onChange,
  placeHolder,
  error,
  tooltip,
  countryCodeValue,
  onChangeCountry,
  inputName,
  componentStyle,
  required,
  fullComponentStyle,
  isDisabled,
  inputStyle,
  readOnly
}) => {
  const theme: Theme = useTheme();

  return (
    // TODO: move styles to styles.ts
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          paddingRight: "0.875rem",
          mt: "0.75rem",
          mb: "0.5rem",
          ...fullComponentStyle
        }}
      >
        <Typography
          variant="placeholder"
          sx={{
            color: isDisabled
              ? theme.palette.text.disabled
              : error
                ? theme.palette.error.contrastText
                : "black"
          }}
        >
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </Typography>
        {tooltip && <Tooltip title={tooltip} />}
      </Stack>
      <Stack direction="row" alignItems="flex-start" gap={1}>
        <PhoneInput
          value={countryCodeValue}
          onChange={onChangeCountry}
          inputProps={{ readOnly: true }}
          disableDropdown={isDisabled}
          inputStyle={{
            backgroundColor: isDisabled
              ? theme.palette.grey[100]
              : error
                ? theme.palette.error.light
                : theme.palette.grey[100],
            width: "4.0625rem",
            color: theme.palette.grey[700],
            fontSize: "1rem",
            fontWeight: 400,
            fontFamily: "Poppins",
            fontStyle: "normal",
            letterSpacing: "0.0313rem",
            borderTop: error
              ? `${theme.palette.error.contrastText} 0.0625rem solid`
              : "none",
            borderBottom: error
              ? `${theme.palette.error.contrastText} 0.0625rem solid`
              : "none",
            borderRight: error
              ? `${theme.palette.error.contrastText} 0.0625rem solid`
              : "none",
            padding: "0.75rem 0rem 0.75rem 1rem",
            marginLeft: "2.5rem",
            borderRadius: "0.5rem",
            borderTopLeftRadius: "0rem",
            borderBottomLeftRadius: "0rem"
          }}
          specialLabel=""
          countryCodeEditable={false}
          enableSearch
          containerClass={"input-phone-number"}
          buttonStyle={{
            backgroundColor: error
              ? theme.palette.error.light
              : theme.palette.grey[100],
            minWidth: "3.4375rem",
            borderRadius: "0.5rem",
            borderTop: error
              ? `${theme.palette.error.contrastText} 0.0625rem solid`
              : "none",
            borderLeft: error
              ? `${theme.palette.error.contrastText} 0.0625rem solid`
              : "none",
            borderBottom: error
              ? `${theme.palette.error.contrastText} 0.0625rem solid`
              : "none",
            borderTopRightRadius: "0rem",
            borderBottomRightRadius: "0rem",
            cursor: isDisabled ? "not-allowed" : "pointer"
          }}
          dropdownStyle={{
            zIndex: ZIndexEnums.DEFAULT,
            position: "absolute"
          }}
        />
        <InputField
          inputName={inputName}
          placeHolder={placeHolder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          componentStyle={{ mt: 0, width: "400%", ...componentStyle }}
          inputStyle={{
            mt: 0,
            border: error
              ? `${theme.palette.error.contrastText} 0.0625rem solid`
              : "none",
            bgcolor: error ? theme.palette.error.light : "grey.100",
            ...inputStyle
          }}
          inputType="text"
          error={error}
          maxLength={14}
          inputMode="numeric"
          onKeyDown={(e) => {
            // TODO: move this to a separate file and write unit test cases
            if (
              !numberPattern().test(e.key) &&
              e.key !== "Backspace" &&
              !(e.ctrlKey && ["a", "c", "v", "x"].includes(e.key))
            ) {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            // TODO: move this to a separate file and write unit test cases
            if (!numberPattern().test(e.clipboardData.getData("Text"))) {
              e.preventDefault();
            }
          }}
          isDisabled={isDisabled}
        />
      </Stack>
    </>
  );
};

export default InputPhoneNumber;

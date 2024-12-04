import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { type SxProps } from "@mui/system";
import { JSX } from "react";

import CheckIconSmall from "~community/common/assets/Icons/CheckIconSmall";

interface StepperProps {
  activeStep: number;
  steps: string[];
  stepperStyles?: SxProps;
}

const CustomIcon = ({
  isActive,
  completed,
  stepNumber
}: {
  isActive?: boolean;
  completed?: boolean;
  stepNumber: string;
}) => {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "2rem",
        width: "2rem",
        borderRadius: "50%",
        color:
          completed || isActive
            ? theme.palette.primary.dark
            : theme.palette.grey.A100,
        backgroundColor: completed
          ? theme.palette.primary.main
          : isActive
            ? theme.palette.secondary.main
            : theme.palette.common.white,
        border: completed
          ? "none"
          : isActive
            ? `.0625rem solid ${theme.palette.primary.dark}`
            : `.0625rem solid ${theme.palette.grey.A100}`
      }}
    >
      {completed ? (
        <CheckIconSmall
          width="12"
          height="12"
          fill={theme.palette.primary.dark}
        />
      ) : (
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: ".75rem",
            lineHeight: "1rem",
            color: isActive
              ? theme.palette.primary.dark
              : theme.palette.grey.A100
          }}
        >
          {stepNumber}
        </Typography>
      )}
    </div>
  );
};

const StepperComponent = ({
  activeStep,
  steps,
  stepperStyles
}: StepperProps): JSX.Element => {
  const theme = useTheme();
  return (
    <Stepper
      activeStep={activeStep}
      sx={{
        "& .MuiStepConnector-line": {
          border: `.0625rem dashed ${theme.palette.grey.A100}`,
          borderRadius: 1
        },
        "& .MuiStepLabel-label": {
          fontWeight: 400,
          fontSize: ".875rem",
          lineHeight: "1rem",
          color: theme.palette.grey.A100,
          "&.Mui-active": {
            color: theme.palette.primary.dark
          },
          "&.Mui-completed": {
            color: theme.palette.primary.dark
          }
        },
        "& .MuiStepIcon-root": {
          height: "2rem",
          width: "2rem",
          borderRadius: "4rem",
          color: theme.palette.common.white,
          border: `.0625rem solid ${theme.palette.grey.A100}`,
          "&.Mui-active": {
            color: theme.palette.secondary.main,
            border: `.0625rem solid ${theme.palette.primary.dark}`
          },
          "&.Mui-completed": {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.dark,
            border: "none"
          }
        },
        "& .MuiStepIcon-text": {
          fontWeight: 400,
          fontSize: ".625rem",
          lineHeight: "1rem",
          fill: theme.palette.grey.A100,
          "&.Mui-active": {
            fill: theme.palette.primary.dark
          }
        },
        ...stepperStyles
      }}
    >
      {steps.map((label, index) => {
        return (
          <Step key={index}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomIcon {...props} stepNumber={`${index + 1}`} />
              )}
            >
              {label}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default StepperComponent;

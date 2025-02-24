import { useState } from "react";

const useStepper = (steps: string[]) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () =>
    setActiveStep((prevActiveStep) =>
      prevActiveStep < steps.length - 1 ? prevActiveStep + 1 : prevActiveStep
    );

  const handleBack = () =>
    setActiveStep((prevActiveStep) =>
      prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep
    );

  return { steps, activeStep, handleNext, handleBack };
};

export default useStepper;

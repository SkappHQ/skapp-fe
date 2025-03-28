import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import StepperComponent from "~community/common/components/molecules/Stepper/Stepper";
import { useTranslator } from "~community/common/hooks/useTranslator";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import useStepper from "~community/people/hooks/useStepper";

import RouteChangeAreYouSureModal from "../../molecules/RouteChangeAreYouSureModal/RouteChangeAreYouSureModal";
import PeopleFormSections from "../PeopleFormSections/PeopleFormSections";
import styles from "./styles";

const DirectoryAddSectionWrapper = () => {
  const classes = styles();

  const [isAreYouSureModalOpen, setIsAreYouSureModalOpen] = useState(false);
  const allowRouteChangeRef = useRef<boolean>(false);
  const targetRouteRef = useRef<string>("");

  const router = useRouter();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  const { hasChanged } = useFormChangeDetector();

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasChanged) {
      e.preventDefault();
      return "";
    }
  };

  const handleRouteChange = (url: string) => {
    if (allowRouteChangeRef.current) return;
    targetRouteRef.current = url;
    if (hasChanged && !isAreYouSureModalOpen) {
      setIsAreYouSureModalOpen(true);
      router.events.emit("routeChangeError");
      throw "routeChange aborted";
    }
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleRouteChange, handleBeforeUnload]);

  const handleModalResume = () => {
    setIsAreYouSureModalOpen(false);
  };

  const handleModalLeave = async () => {
    setIsAreYouSureModalOpen(false);
    allowRouteChangeRef.current = true;
    const targetRoute = targetRouteRef.current;
    await router.push(targetRoute);
  };

  const { activeStep, steps } = useStepper();

  return (
    <>
      <Box sx={{ my: "0.75rem" }}>
        <StepperComponent
          activeStep={activeStep}
          steps={steps}
          stepperStyles={classes.stepper}
        />
      </Box>
      <PeopleFormSections isAddFlow={true} />
      <RouteChangeAreYouSureModal
        isOpen={isAreYouSureModalOpen}
        onResume={handleModalResume}
        onLeave={handleModalLeave}
        title={translateText(["areYouSureModalTitle"])}
      />
    </>
  );
};

export default DirectoryAddSectionWrapper;

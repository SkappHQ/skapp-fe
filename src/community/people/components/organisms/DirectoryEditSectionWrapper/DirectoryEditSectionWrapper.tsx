import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { useGetEmployee } from "~community/people/api/PeopleApi";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import { usePeopleStore } from "~community/people/store/store";

import DirectorySteppers from "../../molecules/DirectorySteppers/DirectorySteppers";
import EditAllInfoSkeleton from "../../molecules/EditAllInfoSkeleton/EditAllInfoSkeleton";
import EditInfoCard from "../../molecules/EditInfoCard/EditInfoCard";
import EditInfoCardSkeleton from "../../molecules/EditInfoCard/EditInfoCardSkeleton";
import RouteChangeAreYouSureModal from "../../molecules/RouteChangeAreYouSureModal/RouteChangeAreYouSureModal";
import TerminationModalController from "../../molecules/TerminationModalController/TerminationModalController";
import UnsavedChangesModal from "../../molecules/UnsavedChangesModal/UnsavedChangesModal";
import UserDeletionModalController from "../../molecules/UserDeletionModalController/UserDeletionModalController";
import PeopleFormSections from "../PeopleFormSections/PeopleFormSections";

interface Props {
  employeeId: number;
}

const DirectoryEditSectionWrapper = ({ employeeId }: Props) => {
  const { data: employee, isLoading } = useGetEmployee(employeeId);
  const [isAreYouSureModalOpen, setIsAreYouSureModalOpen] = useState(false);
  const allowRouteChangeRef = useRef<boolean>(false);
  const targetRouteRef = useRef<string>("");

  const router = useRouter();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  const {
    isUnsavedChangesModalOpen,
    currentStep,
    nextStep,
    setIsUnsavedChangesModalOpen,
    setCurrentStep,
    setIsUnsavedModalSaveButtonClicked,
    setIsUnsavedModalDiscardButtonClicked,
    setEmployee
  } = usePeopleStore((state) => state);

  useEffect(() => {
    if (employee) {
      setEmployee(employee?.data?.results[0]);
    }
  }, [employee, setEmployee]);

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

  useEffect(() => {
    if (hasChanged && currentStep !== nextStep) {
      setIsUnsavedChangesModalOpen(true);
    } else {
      setCurrentStep(nextStep);
    }
  }, [
    currentStep,
    hasChanged,
    nextStep,
    setCurrentStep,
    setIsUnsavedModalSaveButtonClicked,
    setIsUnsavedModalDiscardButtonClicked,
    setIsUnsavedChangesModalOpen
  ]);

  const handleModalResume = () => {
    setIsAreYouSureModalOpen(false);
  };

  const handleModalLeave = async () => {
    setIsAreYouSureModalOpen(false);
    allowRouteChangeRef.current = true;
    const targetRoute = targetRouteRef.current;
    await router.push(targetRoute);
  };

  return (
    <>
      <Box sx={{ mt: "0.75rem" }}>
        {isLoading ? <EditInfoCardSkeleton /> : <EditInfoCard />}
      </Box>
      <DirectorySteppers employeeId={Number(employeeId)} />
      {isLoading ? (
        <EditAllInfoSkeleton />
      ) : (
        <PeopleFormSections employeeId={Number(employeeId)} />
      )}
      <TerminationModalController />
      <UserDeletionModalController />
      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onDiscard={() => {
          setIsUnsavedModalDiscardButtonClicked(true);
        }}
        onSave={() => {
          setIsUnsavedModalSaveButtonClicked(true);
        }}
      />
      <RouteChangeAreYouSureModal
        isOpen={isAreYouSureModalOpen}
        onResume={handleModalResume}
        onLeave={handleModalLeave}
        title={translateText(["areYouSureModalTitle"])}
      />
    </>
  );
};

export default DirectoryEditSectionWrapper;

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { useGetEmployee } from "~community/people/api/PeopleApi";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import { usePeopleStore } from "~community/people/store/store";

import DirectorySteppers from "../../molecules/DirectorySteppers/DirectorySteppers";
import RouteChangeAreYouSureModal from "../../molecules/RouteChangeAreYouSureModal/RouteChangeAreYouSureModal";
import UnsavedChangesModal from "../../molecules/UnsavedChangesModal/UnsavedChangesModal";
import UserDetailsCentered from "../../molecules/UserDetailsCentered/UserDetailsCentered";
import PeopleAccountSection from "../PeopleAccountSection/PeopleAccountSection";

interface Props {
  employeeId: number;
}
const AccountSectionWrapper = ({ employeeId }: Props) => {
  const { data: employeeData } = useGetEmployee(employeeId);

  const {
    currentStep,
    nextStep,
    isUnsavedChangesModalOpen,
    employee,
    setIsUnsavedChangesModalOpen,
    setCurrentStep,
    setIsUnsavedModalSaveButtonClicked,
    setIsUnsavedModalDiscardButtonClicked,
    setEmployee
  } = usePeopleStore((state) => state);

  useEffect(() => {
    if (employeeData) {
      setEmployee(employeeData?.data?.results[0]);
    }
  }, [employeeData, setEmployee]);

  const { hasChanged } = useFormChangeDetector();

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

  const [isAreYouSureModalOpen, setIsAreYouSureModalOpen] = useState(false);
  const allowRouteChangeRef = useRef<boolean>(false);
  const targetRouteRef = useRef<string>("");

  const router = useRouter();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

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

  return (
    <>
      {employee && (
        <UserDetailsCentered
          selectedUser={employee}
          styles={{
            marginBottom: "1rem",
            marginTop: "1.5rem"
          }}
          enableEdit={true}
        />
      )}
      <DirectorySteppers employeeId={employeeId} isAccountView />
      <PeopleAccountSection />
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

export default AccountSectionWrapper;

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import ROUTES from "~community/common/constants/routes";
import { useTranslator } from "~community/common/hooks/useTranslator";
import LeaveTypeActivationToggleButton from "~community/leave/components/molecules/LeaveTypeActivationToggleButton/LeaveTypeActivationToggleButton";
import UnsavedChangesModal from "~community/leave/components/molecules/UserPromptModals/UnsavedChangesModal/UnsavedChangesModal";
import LeaveTypeForm from "~community/leave/components/organisms/LeaveTypeForm/LeaveTypeForm";
import {
  LeaveTypeFormTypes,
  LeaveTypeModalEnums
} from "~community/leave/enums/LeaveTypeEnums";
import { useLeaveStore } from "~community/leave/store/store";

const LeaveType: NextPage = () => {
  const translateText = useTranslator("leaveModule", "leaveTypes");

  const router = useRouter();
  const { slug } = router.query;

  const { isLeaveTypeFormDirty, setLeaveTypeModalType, resetEditingLeaveType } =
    useLeaveStore((state) => state);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isLeaveTypeFormDirty) {
        setLeaveTypeModalType(LeaveTypeModalEnums.UNSAVED_CHANGES_MODAL);
        throw "Route change aborted";
      } else {
        resetEditingLeaveType();
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isLeaveTypeFormDirty) {
        event.preventDefault();
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    isLeaveTypeFormDirty,
    resetEditingLeaveType,
    router,
    setLeaveTypeModalType
  ]);

  return (
    <>
      <ContentLayout
        title={translateText(["title"])}
        pageHead={translateText(["pageHead"])}
        isDividerVisible
        isBackButtonVisible
        onBackClick={() => router.push(ROUTES.LEAVE.LEAVE_TYPES)}
        customRightContent={
          slug === LeaveTypeFormTypes.EDIT ? (
            <LeaveTypeActivationToggleButton />
          ) : (
            <></>
          )
        }
      >
        <>
          <LeaveTypeForm />
          <UnsavedChangesModal />
        </>
      </ContentLayout>
    </>
  );
};

export default LeaveType;

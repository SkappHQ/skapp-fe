import { NextPage } from "next";
import { useRouter } from "next/router";

import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import ROUTES from "~community/common/constants/routes";
import { useRouteChangeHandler } from "~community/common/hooks/useRouteChangeHandler";
import { useTranslator } from "~community/common/hooks/useTranslator";
import LeaveTypeActivationToggleButton from "~community/leave/components/molecules/LeaveTypeActivationToggleButton/LeaveTypeActivationToggleButton";
import UnsavedChangesModal from "~community/leave/components/molecules/UserPromptModals/UnsavedChangesModal/UnsavedChangesModal";
import LeaveTypeForm from "~community/leave/components/organisms/LeaveTypeForm/LeaveTypeForm";
import {
  LeaveTypeFormTypes,
  LeaveTypeModalEnums
} from "~community/leave/enums/LeaveTypeEnums";
import { useLeaveStore } from "~community/leave/store/store";
import { useCommonEnterpriseStore } from "~enterprise/common/store/commonStore";

const LeaveType: NextPage = () => {
  const translateText = useTranslator("leaveModule", "leaveTypes");
  const router = useRouter();
  const { slug } = router.query;

  const {
    isLeaveTypeFormDirty,
    isLeaveTypeModalOpen,
    setLeaveTypeModalType,
    resetEditingLeaveType,
    setPendingNavigation
  } = useLeaveStore((state) => ({
    isLeaveTypeFormDirty: state.isLeaveTypeFormDirty,
    isLeaveTypeModalOpen: state.isLeaveTypeModalOpen,
    setLeaveTypeModalType: state.setLeaveTypeModalType,
    resetEditingLeaveType: state.resetEditingLeaveType,
    setPendingNavigation: state.setPendingNavigation
  }));

  const { stopAllOngoingQuickSetup } = useCommonEnterpriseStore((state) => ({
    stopAllOngoingQuickSetup: state.stopAllOngoingQuickSetup
  }));

  useRouteChangeHandler({
    preventNavigation: () => isLeaveTypeFormDirty && !isLeaveTypeModalOpen,
    onBeforeRouteAbort: (url) => {
      setPendingNavigation(url);
      setLeaveTypeModalType(LeaveTypeModalEnums.UNSAVED_CHANGES_MODAL);
    },
    onRouteChange: () => {
      resetEditingLeaveType();
    }
  });

  const handleBackBtnClick = () => {
    stopAllOngoingQuickSetup();
    router.push(ROUTES.LEAVE.LEAVE_TYPES);
  };

  return (
    <ContentLayout
      title={
        slug === LeaveTypeFormTypes.EDIT
          ? translateText(["editLeaveType"])
          : translateText(["addLeaveType"])
      }
      pageHead={translateText(["pageHead"])}
      isDividerVisible
      isBackButtonVisible
      onBackClick={handleBackBtnClick}
      customRightContent={
        slug === LeaveTypeFormTypes.EDIT ? (
          <LeaveTypeActivationToggleButton />
        ) : undefined
      }
    >
      <>
        <LeaveTypeForm />
        <UnsavedChangesModal />
      </>
    </ContentLayout>
  );
};

export default LeaveType;

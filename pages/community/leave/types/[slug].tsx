import { NextPage } from "next";
import { useRouter } from "next/router";

import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import LeaveTypeActivationToggleButton from "~community/leave/components/molecules/LeaveTypeActivationToggleButton/LeaveTypeActivationToggleButton";
import UnsavedChangesModal from "~community/leave/components/molecules/UserPromptModals/UnsavedChangesModal/UnsavedChangesModal";
import LeaveTypeForm from "~community/leave/components/organisms/LeaveTypeForm/LeaveTypeForm";
import { LeaveTypeFormTypes } from "~community/leave/enums/LeaveTypeEnums";
import { useLeaveStore } from "~community/leave/store/store";
import { handleBackBtnClick } from "~community/leave/utils/leaveTypes/LeaveTypeUtils";

const LeaveType: NextPage = () => {
  const translateText = useTranslator("leaveModule", "leaveTypes");

  const router = useRouter();
  const { slug } = router.query;

  const { isLeaveTypeFormDirty, setLeaveTypeModalType, resetEditingLeaveType } =
    useLeaveStore((state) => state);

  return (
    <>
      <ContentLayout
        title={
          slug === LeaveTypeFormTypes.EDIT
            ? translateText(["editLeaveType"])
            : translateText(["addLeaveType"])
        }
        pageHead={translateText(["pageHead"])}
        isDividerVisible
        isBackButtonVisible
        onBackClick={() =>
          handleBackBtnClick({
            router,
            isLeaveTypeFormDirty,
            resetEditingLeaveType,
            setLeaveTypeModalType
          })
        }
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

import UserPromptModal from "~community/common/components/molecules/UserPromptModal/UserPromptModal";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { JobFamilyActionModalEnums } from "~community/people/enums/JobFamilyEnums";
import { usePeopleStore } from "~community/people/store/store";

const UnsavedChangesModal = () => {
  const translateText = useTranslator("peopleModule", "jobFamily");

  const { jobFamilyModalType, setJobFamilyModalType } = usePeopleStore(
    (state) => state
  );

  const handleCancelBtnClick = () => {
    const modalTypeMap = {
      [JobFamilyActionModalEnums.UNSAVED_CHANGES_JOB_FAMILY]:
        JobFamilyActionModalEnums.EDIT_JOB_FAMILY,
      [JobFamilyActionModalEnums.UNSAVED_CHANGES_JOB_FAMILY_TRANSFER_MEMBERS]:
        JobFamilyActionModalEnums.JOB_FAMILY_TRANSFER_MEMBERS,
      [JobFamilyActionModalEnums.UNSAVED_CHANGED_JOB_TITLE_TRANSFER_MEMBERS]:
        JobFamilyActionModalEnums.JOB_TITLE_TRANSFER_MEMBERS
    };

    const newModalType =
      modalTypeMap[jobFamilyModalType as keyof typeof modalTypeMap];
    if (newModalType) {
      setJobFamilyModalType(newModalType);
    }
  };

  return (
    <UserPromptModal
      description={translateText(["unsavedChangesModalDescription"])}
      primaryBtn={{
        label: translateText(["keepEditingBtn"]),
        onClick: handleCancelBtnClick,
        endIcon: IconName.RIGHT_ARROW_ICON
      }}
      secondaryBtn={{
        label: translateText(["discardBtnText"]),
        onClick: () => setJobFamilyModalType(JobFamilyActionModalEnums.NONE),
        endIcon: IconName.CLOSE_ICON
      }}
    />
  );
};

export default UnsavedChangesModal;

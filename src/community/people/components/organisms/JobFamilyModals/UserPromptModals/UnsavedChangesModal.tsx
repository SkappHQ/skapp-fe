import AreYouSureModal from "~community/common/components/molecules/AreYouSureModal/AreYouSureModal";
import { JobFamilyActionModalEnums } from "~community/people/enums/JobFamilyEnums";
import { usePeopleStore } from "~community/people/store/store";

const UnsavedChangesModal = () => {
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
    <AreYouSureModal
      onPrimaryBtnClick={handleCancelBtnClick}
      onSecondaryBtnClick={() =>
        setJobFamilyModalType(JobFamilyActionModalEnums.NONE)
      }
    />
  );
};

export default UnsavedChangesModal;

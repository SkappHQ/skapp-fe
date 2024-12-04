import { useSession } from "next-auth/react";
import { Dispatch, FC, SetStateAction, useMemo } from "react";

import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes } from "~community/common/types/AuthTypes";
import AddJobFamilyModal from "~community/people/components/organisms/JobFamilyModals/JobFamilyFormModals/AddJobFamilyModal";
import EditJobFamilyModal from "~community/people/components/organisms/JobFamilyModals/JobFamilyFormModals/EditJobFamilyModal";
import JobFamilyTransferMembersModal from "~community/people/components/organisms/JobFamilyModals/TransferMembersModals/JobFamilyTransferMembersModal";
import JobTitleTransferMembersModal from "~community/people/components/organisms/JobFamilyModals/TransferMembersModals/JobTitleTransferMembersModal";
import AddNewJobFamily from "~community/people/components/organisms/JobFamilyModals/UserPromptModals/AddNewJobFamily";
import AddNewJobTitle from "~community/people/components/organisms/JobFamilyModals/UserPromptModals/AddNewJobTitle";
import JobFamilyDeleteConfirmationModal from "~community/people/components/organisms/JobFamilyModals/UserPromptModals/JobFamilyDeleteConfirmationModal";
import JobFamilyDeletionWarningModal from "~community/people/components/organisms/JobFamilyModals/UserPromptModals/JobFamilyDeletionWarningModal";
import JobTitleDeleteConfirmationModal from "~community/people/components/organisms/JobFamilyModals/UserPromptModals/JobTitleDeleteConfirmationModal";
import JobTitleDeletionWarningModal from "~community/people/components/organisms/JobFamilyModals/UserPromptModals/JobTitleDeletionWarningModal";
import JobTitleEditConfirmationModal from "~community/people/components/organisms/JobFamilyModals/UserPromptModals/JobTitleEditConfirmationModal";
import UnsavedChangesModal from "~community/people/components/organisms/JobFamilyModals/UserPromptModals/UnsavedChangesModal";
import { JobFamilyActionModalEnums } from "~community/people/enums/JobFamilyEnums";
import { usePeopleStore } from "~community/people/store/store";
import {
  checkDataChanges,
  getCustomStyles,
  getModalTitle,
  handleJobFamilyCloseModal,
  isClosableModalType
} from "~community/people/utils/jobFamilyUtils/modalControllerUtils";

interface Props {
  setLatestRoleLabel?: Dispatch<SetStateAction<number | undefined>>;
  from?: string;
}

const JobFamilyModalController: FC<Props> = ({ setLatestRoleLabel, from }) => {
  const { data: session } = useSession();

  const isAdmin = session?.user?.roles?.includes(AdminTypes.PEOPLE_ADMIN);

  const peopleTranslateText = useTranslator("peopleModule", "jobFamily");

  const {
    currentTransferMembersData,
    isJobFamilyModalOpen,
    jobFamilyModalType,
    currentEditingJobFamily,
    allJobFamilies,
    setJobFamilyModalType
  } = usePeopleStore((state) => state);

  const customStyles = useMemo(() => {
    return getCustomStyles(jobFamilyModalType);
  }, [jobFamilyModalType]);

  const hasDataChanged: boolean = useMemo(() => {
    return checkDataChanges(
      jobFamilyModalType,
      currentEditingJobFamily,
      allJobFamilies,
      currentTransferMembersData
    );
  }, [
    jobFamilyModalType,
    currentTransferMembersData,
    currentEditingJobFamily,
    allJobFamilies
  ]);

  return (
    <ModalController
      isModalOpen={isJobFamilyModalOpen}
      modalTitle={
        isAdmin
          ? getModalTitle(jobFamilyModalType, peopleTranslateText)
          : peopleTranslateText(["viewJobFamilyTitle"])
      }
      handleCloseModal={() =>
        handleJobFamilyCloseModal(
          hasDataChanged,
          jobFamilyModalType,
          setJobFamilyModalType
        )
      }
      isClosable={isClosableModalType(jobFamilyModalType)}
      modalWrapperStyles={customStyles.modalWrapperStyles}
      modalContentStyles={customStyles.modalContentStyles}
    >
      <>
        {jobFamilyModalType === JobFamilyActionModalEnums.ADD_JOB_FAMILY && (
          <AddJobFamilyModal
            hasDataChanged={hasDataChanged}
            setLatestRoleLabel={setLatestRoleLabel}
            from={from}
          />
        )}

        {jobFamilyModalType === JobFamilyActionModalEnums.EDIT_JOB_FAMILY && (
          <EditJobFamilyModal hasDataChanged={hasDataChanged} />
        )}

        {jobFamilyModalType ===
          JobFamilyActionModalEnums.JOB_FAMILY_DELETE_CONFIRMATION && (
          <JobFamilyDeleteConfirmationModal />
        )}

        {jobFamilyModalType ===
          JobFamilyActionModalEnums.JOB_FAMILY_DELETION_WARNING && (
          <JobFamilyDeletionWarningModal />
        )}

        {jobFamilyModalType ===
          JobFamilyActionModalEnums.JOB_TITLE_DELETE_CONFIRMATION && (
          <JobTitleDeleteConfirmationModal />
        )}

        {jobFamilyModalType ===
          JobFamilyActionModalEnums.JOB_TITLE_DELETION_WARNING && (
          <JobTitleDeletionWarningModal />
        )}

        {jobFamilyModalType ===
          JobFamilyActionModalEnums.JOB_TITLE_EDIT_CONFIRMATION && (
          <JobTitleEditConfirmationModal />
        )}

        {jobFamilyModalType ===
          JobFamilyActionModalEnums.ADD_NEW_JOB_FAMILY && <AddNewJobFamily />}

        {jobFamilyModalType === JobFamilyActionModalEnums.ADD_NEW_JOB_TITLE && (
          <AddNewJobTitle />
        )}

        {jobFamilyModalType ===
          JobFamilyActionModalEnums.JOB_FAMILY_TRANSFER_MEMBERS && (
          <JobFamilyTransferMembersModal />
        )}

        {jobFamilyModalType ===
          JobFamilyActionModalEnums.JOB_TITLE_TRANSFER_MEMBERS && (
          <JobTitleTransferMembersModal />
        )}

        {(jobFamilyModalType ===
          JobFamilyActionModalEnums.UNSAVED_CHANGES_JOB_FAMILY ||
          jobFamilyModalType ===
            JobFamilyActionModalEnums.UNSAVED_CHANGES_JOB_FAMILY_TRANSFER_MEMBERS ||
          jobFamilyModalType ===
            JobFamilyActionModalEnums.UNSAVED_CHANGED_JOB_TITLE_TRANSFER_MEMBERS) && (
          <UnsavedChangesModal />
        )}
      </>
    </ModalController>
  );
};

export default JobFamilyModalController;

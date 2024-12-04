import { FC, Fragment, useState } from "react";

import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { useGetAllHolidaysInfinite } from "~community/people/api/HolidayApi";
import AddCalendar from "~community/people/components/molecules/HolidayModals/AddCalendar/AddCalendar";
import AddEditHolidayModal from "~community/people/components/molecules/HolidayModals/AddEditHolidayModal/AddEditHolidayModal";
import HolidayBulkDelete from "~community/people/components/molecules/HolidayModals/HolidayBulkDelete/HolidayBulkDelete";
import { usePeopleStore } from "~community/people/store/store";
import {
  HolidayDeleteType,
  holidayBulkUploadResponse,
  holidayModalTypes
} from "~community/people/types/HolidayTypes";

import BulkUploadSummary from "../../molecules/HolidayModals/BulkUploadSummary/BulkUploadSummary";
import HolidayExitConfirmationModal from "../../molecules/HolidayModals/HolidayExitConfirmationModal/HolidayConfirmationModal";
import UploadHolidayBulk from "../../molecules/HolidayModals/UploadHolidayBulk/UploadHolidayBulk";

const HolidayModalController: FC = () => {
  const { toastMessage } = useToast();
  const [bulkUploadData, setBulkUploadData] = useState<
    holidayBulkUploadResponse | undefined
  >();
  const translateText = useTranslator("peopleModule", "holidays");
  const {
    newCalenderDetails,
    newHolidayDetails,
    isHolidayModalOpen,
    holidayModalType,
    setIsHolidayModalOpen,
    setHolidayModalType,
    selectedYear,
    setIsBulkUpload
  } = usePeopleStore((state) => state);
  const { data: holidays, refetch } = useGetAllHolidaysInfinite(selectedYear);

  const getModalTitle = (): string => {
    switch (holidayModalType) {
      case holidayModalTypes.ADD_EDIT_HOLIDAY:
        return translateText(["addHoliday"]);
      case holidayModalTypes.ADD_CALENDAR:
        return translateText(["addHolidays"]);
      case holidayModalTypes.UPLOAD_HOLIDAY_BULK:
        return translateText(["addHolidays"]);
      case holidayModalTypes.HOLIDAY_SELECTED_DELETE:
        return translateText(["confirmDeletion"]);
      case holidayModalTypes.HOLIDAY_BULK_DELETE:
        return translateText(["confirmDeletion"]);
      case holidayModalTypes.HOLIDAY_INDIVIDUAL_DELETE:
        return translateText(["confirmDeletion"]);
      case holidayModalTypes.UPLOAD_SUMMARY:
        return translateText(["uploadSummeryModalTitle"]);
      case holidayModalTypes.HOLIDAY_EXIT_CONFIRMATION:
        return translateText(["deletionConfirmTitle"]);
      default:
        return "";
    }
  };
  const handleCloseModal = (): void => {
    const isEditingHoliday =
      newCalenderDetails?.acceptedFile?.length !== 0 ||
      newHolidayDetails.holidayDate ||
      newHolidayDetails.duration ||
      newHolidayDetails.holidayReason;

    const isExitConfirmationNeeded =
      holidayModalType === holidayModalTypes.UPLOAD_HOLIDAY_BULK ||
      holidayModalType === holidayModalTypes.ADD_EDIT_HOLIDAY;
    if (isEditingHoliday) setIsBulkUpload(false);
    if (isEditingHoliday && isExitConfirmationNeeded) {
      setHolidayModalType(holidayModalTypes.HOLIDAY_EXIT_CONFIRMATION);
    } else {
      setIsHolidayModalOpen(false);
      setHolidayModalType(holidayModalTypes.NONE);
    }
  };

  return (
    <>
      <ModalController
        isModalOpen={isHolidayModalOpen}
        handleCloseModal={handleCloseModal}
        modalTitle={getModalTitle()}
        isClosable={
          holidayModalType === holidayModalTypes.HOLIDAY_EXIT_CONFIRMATION ||
          holidayModalType === holidayModalTypes.HOLIDAY_BULK_DELETE ||
          holidayModalType === holidayModalTypes.HOLIDAY_INDIVIDUAL_DELETE ||
          holidayModalType === holidayModalTypes.HOLIDAY_SELECTED_DELETE
            ? false
            : true
        }
        setModalType={setHolidayModalType}
      >
        <Fragment>
          {holidayModalType === holidayModalTypes.ADD_EDIT_HOLIDAY && (
            <AddEditHolidayModal holidays={holidays} holidayRefetch={refetch} />
          )}
          {holidayModalType === holidayModalTypes.ADD_CALENDAR && (
            <AddCalendar setBulkUploadData={setBulkUploadData} />
          )}
          {holidayModalType === holidayModalTypes.HOLIDAY_SELECTED_DELETE && (
            <HolidayBulkDelete
              setIsPopupOpen={setIsHolidayModalOpen}
              type={HolidayDeleteType.SELECTED}
            />
          )}
          {holidayModalType === holidayModalTypes.HOLIDAY_BULK_DELETE && (
            <HolidayBulkDelete
              setIsPopupOpen={setIsHolidayModalOpen}
              type={HolidayDeleteType.ALL}
            />
          )}
          {holidayModalType === holidayModalTypes.HOLIDAY_INDIVIDUAL_DELETE && (
            <HolidayBulkDelete
              setIsPopupOpen={setIsHolidayModalOpen}
              type={HolidayDeleteType.INDIVIDUAL}
            />
          )}
          {bulkUploadData &&
            holidayModalType === holidayModalTypes.UPLOAD_SUMMARY &&
            bulkUploadData?.bulkStatusSummary?.failedCount > 0 && (
              <BulkUploadSummary data={bulkUploadData} />
            )}
          {holidayModalType === holidayModalTypes.HOLIDAY_EXIT_CONFIRMATION && (
            <HolidayExitConfirmationModal />
          )}

          {holidayModalType === holidayModalTypes.UPLOAD_HOLIDAY_BULK && (
            <UploadHolidayBulk setBulkUploadData={setBulkUploadData} />
          )}
        </Fragment>
      </ModalController>
      <ToastMessage
        open={toastMessage.open}
        onClose={toastMessage.onClose}
        title={toastMessage.title}
        description={toastMessage.description}
        toastType={toastMessage.toastType}
        autoHideDuration={toastMessage.autoHideDuration}
      />
    </>
  );
};

export default HolidayModalController;

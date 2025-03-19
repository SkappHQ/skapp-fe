import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import DeleteButtonIcon from "~community/common/assets/Icons/DeleteButtonIcon";
import Button from "~community/common/components/atoms/Button/Button";
import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import Table from "~community/common/components/molecules/Table/Table";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { testPassiveEventSupport } from "~community/common/utils/commonUtil";
import SortByDropDown from "~community/people/components/molecules/SortByDropDown/SortByDropDown";
import { usePeopleStore } from "~community/people/store/store";
import {
  HolidayDataType,
  HolidayDurationType,
  holiday,
  holidayModalTypes
} from "~community/people/types/HolidayTypes";
import { getFormattedDate } from "~community/people/utils/holidayUtils/commonUtils";
import useProductTour from "~enterprise/common/hooks/useProductTour";
import { useCommonEnterpriseStore } from "~enterprise/common/store/commonStore";

import { styles } from "./styles";

interface Props {
  holidayData?: holiday[];
  setPopupTitle?: (title: string) => string | undefined;
  isHolidayLoading?: boolean;
  holidaySelectedYear?: string;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage?: boolean;
  isFetching?: boolean;
}

const HolidayTable: FC<Props> = ({
  holidayData,
  setPopupTitle,
  holidaySelectedYear,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  isFetching
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const { isPeopleAdmin } = useSessionData();

  const { destroyDriverObj } = useProductTour();

  const { setIsHolidayModalOpen, setHolidayModalType } = usePeopleStore(
    (state) => ({
      setIsHolidayModalOpen: state.setIsHolidayModalOpen,
      setHolidayModalType: state.setHolidayModalType
    })
  );

  const [selectedHolidays, setSelectedHolidays] = useState<number[]>([]);

  const { ongoingQuickSetup } = useCommonEnterpriseStore((state) => ({
    ongoingQuickSetup: state.ongoingQuickSetup
  }));

  const translateText = useTranslator("peopleModule", "holidays");

  const listInnerRef = useRef<HTMLDivElement>();
  const supportsPassive = testPassiveEventSupport();

  const { setIndividualDeleteId, selectedDeleteIds, setSelectedDeleteIds } =
    usePeopleStore((state) => state);

  const columns = [
    { field: "date", headerName: translateText(["tableDateColumnTitle"]) },
    {
      field: "holidayName",
      headerName: translateText(["tableHolidayNameColumnTitle"])
    }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  const returnDurationLabel = (duration: string): string => {
    switch (duration) {
      case HolidayDurationType.FULLDAY:
        return translateText(["fullDay"]);
      case HolidayDurationType.HALFDAY_MORNING:
        return translateText(["halfDayMorning"]);
      case HolidayDurationType.HALFDAY_EVENING:
        return translateText(["halfDayEvening"]);
      default:
        return duration;
    }
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;
      if (isNearBottom && !isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;

    if (!isFetchingNextPage && listInnerElement) {
      listInnerElement.addEventListener(
        "touchmove",
        onScroll,
        supportsPassive ? { passive: true } : false
      );

      listInnerElement?.addEventListener(
        "wheel",
        onScroll,
        supportsPassive ? { passive: true } : false
      );

      return () => {
        listInnerElement?.removeEventListener("touchmove", onScroll);
        listInnerElement?.removeEventListener("wheel", onScroll);
      };
    }
  }, [isFetchingNextPage, hasNextPage]);

  const transformToTableRows = () => {
    return (
      (Array.isArray(holidayData) &&
        holidayData.map((holiday) => ({
          id: holiday.id,
          date: (
            <Box
              sx={{
                color: "common.black",
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "center",
                gap: "0.625rem",
                flex: 2
              }}
            >
              <Typography variant="body1">
                {getFormattedDate(holiday?.date || "", true)}
              </Typography>
              <BasicChip
                label={returnDurationLabel(holiday?.holidayDuration || "")}
                chipStyles={{ mx: "0.3125rem" }}
              />
            </Box>
          ),
          holidayName: holiday?.name,
          actionData: holiday?.id
        }))) ||
      []
    );
  };

  const renderDeleteAllButton = () => {
    return (
      <Box>
        <Button
          label={
            selectedHolidays.length
              ? translateText(["deleteSelectedTitle"])
              : translateText(["deleteAllTitle"])
          }
          buttonStyle={ButtonStyle.SECONDARY}
          size={ButtonSizes.MEDIUM}
          startIcon={<DeleteButtonIcon />}
          onClick={handleBulkDelete}
          disabled={isDeleteButtonDisabled()}
        />
      </Box>
    );
  };

  const handleBulkDelete = () => {
    if (selectedHolidays.length) {
      setSelectedDeleteIds(selectedHolidays);
      if (setPopupTitle && setIsHolidayModalOpen && setHolidayModalType) {
        setPopupTitle(translateText(["holidayDeleteModalTitle"]));
        setHolidayModalType(holidayModalTypes.HOLIDAY_SELECTED_DELETE);
        setIsHolidayModalOpen(true);
      }
    } else {
      if (setPopupTitle && setIsHolidayModalOpen && setHolidayModalType) {
        setSelectedDeleteIds(selectedHolidays);
        setPopupTitle(translateText(["holidayDeleteModalTitle"]));
        setHolidayModalType(holidayModalTypes.HOLIDAY_BULK_DELETE);
        setIsHolidayModalOpen(true);
      }
    }
  };

  const handleCheckBoxClick = (holidayId: number) => () => {
    setSelectedHolidays((prevSelectedHolidays) => {
      if (!prevSelectedHolidays.includes(holidayId)) {
        return [...prevSelectedHolidays, holidayId];
      } else {
        return prevSelectedHolidays.filter(
          (selectedId) => selectedId !== holidayId
        );
      }
    });
  };

  const handleAllCheckBoxClick = () => {
    if (selectedHolidays.length === holidayData?.length) {
      setSelectedHolidays([]);
    } else {
      setSelectedHolidays(holidayData?.map((holiday) => holiday.id || 0) || []);
    }
  };

  const handleIndividualDelete = (holidayId: number) => {
    setIndividualDeleteId(holidayId);
    if (setPopupTitle && setIsHolidayModalOpen && setHolidayModalType) {
      setPopupTitle(translateText(["holidayDeleteModalTitle"]));
      setHolidayModalType(holidayModalTypes.HOLIDAY_INDIVIDUAL_DELETE);
      setIsHolidayModalOpen(true);
    }
  };

  useEffect(() => {
    setSelectedHolidays(selectedDeleteIds);
  }, [selectedDeleteIds]);

  const isDeleteButtonDisabled = useCallback(() => {
    if (holidayData && holidayData?.length > 0) {
      const currentDate = new Date().toISOString().slice(0, 10);
      const filteredHolidays = holidayData?.filter(
        (holiday: HolidayDataType) => (holiday?.date || "") < currentDate
      );

      return filteredHolidays?.length === holidayData?.length;
    }

    return holidayData?.length === 0;
  }, [holidayData]);

  const AddHolidayButtonClick = () => {
    setHolidayModalType(holidayModalTypes.ADD_CALENDAR);
    setIsHolidayModalOpen(true);

    if (ongoingQuickSetup.SETUP_HOLIDAYS) {
      destroyDriverObj();
    }
  };

  return (
    <Stack sx={classes.wrapper}>
      <Box sx={classes.container} ref={listInnerRef}>
        <Table
          tableHeaders={tableHeaders}
          tableRows={transformToTableRows()}
          actionRowOneLeftButton={
            <SortByDropDown
              listInnerRef={listInnerRef}
              holidayData={holidayData}
            />
          }
          actionRowOneRightButton={
            holidayData && holidayData?.length > 0 && isPeopleAdmin
              ? renderDeleteAllButton()
              : null
          }
          selectedRows={selectedHolidays}
          skeletonRows={5}
          handleRowCheck={handleCheckBoxClick}
          isLoading={isFetching && !isFetchingNextPage}
          isDataAvailable={holidayData && holidayData?.length > 0}
          emptyDataDescription={translateText(["noHolidayDes"])}
          emptyDataTitle={translateText(["noHolidaysTitle"], {
            selectedYear: holidaySelectedYear
          })}
          emptyScreenButtonText={
            isPeopleAdmin ? translateText(["addHolidaysBtn"]) : ""
          }
          tableContainerStyles={{ border: 0, maxHeight: "32rem" }}
          tableHeaderTypographyStyles={{
            paddingLeft: isPeopleAdmin ? "0rem" : "1rem"
          }}
          tableRowCellStyles={{ paddingLeft: isPeopleAdmin ? "0rem" : "1rem" }}
          tableRowStyles={{ paddingLeft: isPeopleAdmin ? "0rem" : "1rem" }}
          onEmptyScreenBtnClick={AddHolidayButtonClick}
          isPaginationEnabled={false}
          isCheckboxSelectionEnabled={isPeopleAdmin}
          isSelectAllCheckboxEnabled={holidayData?.length === 0 ? false : true}
          actionColumnIconBtnRight={
            isPeopleAdmin
              ? {
                  OnClick: (data) => handleIndividualDelete(data),
                  styles: { mr: "1rem" }
                }
              : null
          }
          handleAllRowsCheck={handleAllCheckBoxClick}
          tableCheckboxStyles={{
            color: selectedHolidays
              ? theme.palette.grey[600]
              : theme.palette.primary.main,
            marginRight: "0rem"
          }}
          tableHeaderCellStyles={classes.tableHeaderCellStyles}
        />
      </Box>
    </Stack>
  );
};

export default HolidayTable;

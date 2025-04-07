import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import { isDateGraterThanToday } from "~community/common/utils/dateTimeUtils";
import SortByDropDown from "~community/people/components/molecules/SortByDropDown/SortByDropDown";
import { usePeopleStore } from "~community/people/store/store";
import {
  Holiday,
  HolidayDataType,
  HolidayDurationType,
  holidayModalTypes
} from "~community/people/types/HolidayTypes";
import { getFormattedDate } from "~community/people/utils/holidayUtils/commonUtils";
import useProductTour from "~enterprise/common/hooks/useProductTour";
import { useCommonEnterpriseStore } from "~enterprise/common/store/commonStore";

import { styles } from "./styles";

interface Props {
  holidayData: Holiday[];
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

  const listInnerRef = useRef<HTMLDivElement>();

  const supportsPassive = testPassiveEventSupport();

  const { isPeopleAdmin } = useSessionData();

  const { destroyDriverObj } = useProductTour();

  const translateText = useTranslator("peopleModule", "holidays");

  const {
    setIsHolidayModalOpen,
    setHolidayModalType,
    setIndividualDeleteId,
    selectedDeleteIds,
    setSelectedDeleteIds
  } = usePeopleStore((state) => ({
    setIsHolidayModalOpen: state.setIsHolidayModalOpen,
    setHolidayModalType: state.setHolidayModalType,
    setIndividualDeleteId: state.setIndividualDeleteId,
    selectedDeleteIds: state.selectedDeleteIds,
    setSelectedDeleteIds: state.setSelectedDeleteIds
  }));

  const { ongoingQuickSetup, quickSetupCurrentFlowSteps } =
    useCommonEnterpriseStore((state) => ({
      ongoingQuickSetup: state.ongoingQuickSetup,
      quickSetupCurrentFlowSteps: state.quickSetupCurrentFlowSteps
    }));

  const [selectedHolidays, setSelectedHolidays] = useState<number[]>([]);

  const tableHeaders = [
    { id: "date", label: translateText(["tableDateColumnTitle"]) },
    {
      id: "holidayName",
      label: translateText(["tableHolidayNameColumnTitle"])
    }
  ];

  const transformToTableRows = useCallback(() => {
    const returnDurationLabel = (duration: HolidayDurationType): string => {
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

    return (
      (Array.isArray(holidayData) &&
        holidayData.map((holiday) => ({
          id: holiday.id,
          date: (
            <Box sx={classes.dateWrapper}>
              <Typography variant="body1">
                {getFormattedDate(holiday?.date || "", true)}
              </Typography>
              <BasicChip
                label={returnDurationLabel(
                  holiday?.holidayDuration || HolidayDurationType.NONE
                )}
                chipStyles={{ mx: "0.3125rem" }}
              />
            </Box>
          ),
          holidayName: holiday?.name,
          actionData: holiday?.id
        }))) ||
      []
    );
  }, [classes.dateWrapper, holidayData, translateText]);

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

  const renderDeleteAllButton = () => {
    return holidayData && holidayData?.length > 0 && isPeopleAdmin ? (
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
    ) : undefined;
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

  const handleIndividualSelectClick = (id: number) => () => {
    setSelectedHolidays((prevSelectedHolidays) => {
      if (!prevSelectedHolidays.includes(id)) {
        return [...prevSelectedHolidays, id];
      } else {
        return prevSelectedHolidays.filter((selectedId) => selectedId !== id);
      }
    });
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

  const futureHolidays = useMemo(() => {
    if (holidayData && holidayData?.length > 0) {
      const filteredHolidays = holidayData?.filter(
        (holiday: HolidayDataType) => {
          return isDateGraterThanToday(holiday?.date || "");
        }
      );

      return filteredHolidays;
    }

    return [];
  }, [holidayData]);

  const isSelectAllCheckboxEnabled = useMemo(() => {
    if (holidayData && holidayData?.length > 0) {
      return isPeopleAdmin && futureHolidays?.length !== holidayData?.length;
    }

    return isPeopleAdmin;
  }, [futureHolidays?.length, holidayData, isPeopleAdmin]);

  const isSelectAllCheckboxChecked = useMemo(() => {
    return selectedHolidays?.length === futureHolidays?.length;
  }, [selectedHolidays, futureHolidays]);

  const isRowDisabled = useCallback(
    (id: number) => {
      const holiday = holidayData.find((holiday) => holiday.id === id);

      return !isDateGraterThanToday(holiday?.date || "");
    },
    [holidayData]
  );

  const handleSelectAllCheckboxClick = () => {
    if (selectedHolidays.length === futureHolidays?.length) {
      setSelectedHolidays([]);
    } else {
      setSelectedHolidays(
        futureHolidays?.map((holiday) => holiday.id || 0) || []
      );
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

  return (
    <Stack sx={classes.wrapper}>
      <Box sx={classes.container} ref={listInnerRef}>
        <Table
          tableName="holidays"
          headers={tableHeaders}
          isLoading={isFetching && !isFetchingNextPage}
          rows={transformToTableRows()}
          isRowDisabled={isRowDisabled}
          selectedRows={selectedHolidays}
          checkboxSelection={{
            isEnabled: true,
            isSelectAllEnabled: isSelectAllCheckboxEnabled,
            isSelectAllChecked: isSelectAllCheckboxChecked,
            handleIndividualSelectClick: handleIndividualSelectClick,
            handleSelectAllClick: handleSelectAllCheckboxClick
          }}
          actionToolbar={{
            firstRow: {
              leftButton: (
                <SortByDropDown
                  listInnerRef={listInnerRef}
                  holidayData={holidayData}
                />
              ),
              rightButton: renderDeleteAllButton()
            }
          }}
          tableBody={{
            actionColumn: {
              isEnabled: Boolean(isPeopleAdmin),
              actionBtns: {
                right: isPeopleAdmin
                  ? {
                      styles: { mr: "1rem" },
                      onClick: (data) => handleIndividualDelete(data)
                    }
                  : undefined
              }
            },
            emptyState: {
              noData: {
                title: translateText(["noHolidaysTitle"], {
                  selectedYear: holidaySelectedYear
                }),
                description: isPeopleAdmin
                  ? translateText(["noHolidayDesForAdmin"])
                  : translateText(["noHolidayDesForNonAdmin"]),
                button: isPeopleAdmin
                  ? {
                      id: "add-holidays-empty-table-screen-button",
                      label: translateText(["addHolidaysBtn"]),
                      onClick: AddHolidayButtonClick,
                      shouldBlink:
                        ongoingQuickSetup.SETUP_HOLIDAYS &&
                        quickSetupCurrentFlowSteps !== null
                    }
                  : undefined
              }
            },
            loadingState: {
              skeleton: {
                rows: 5
              }
            }
          }}
          tableFoot={{
            pagination: {
              isEnabled: false
            }
          }}
          customStyles={{
            container: { border: 0, maxHeight: "32rem" }
          }}
        />
      </Box>
    </Stack>
  );
};

export default HolidayTable;

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { type Theme, useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import DeleteButtonIcon from "~community/common/assets/Icons/DeleteButtonIcon";
import Button from "~community/common/components/atoms/Button/Button";
import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import ItemSelector from "~community/common/components/molecules/ItemSelector/ItemSelector";
import Table from "~community/common/components/molecules/Table/Table";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes } from "~community/common/types/AuthTypes";
import { OptionType } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import { testPassiveEventSupport } from "~community/common/utils/commonUtil";
import { options } from "~community/common/utils/dateTimeUtils";
import HolidayDataMenu from "~community/people/components/molecules/HolidayDataMenu/HolidayDataMenu";
import { usePeopleStore } from "~community/people/store/store";
import {
  HolidayDataType,
  HolidayDurationType,
  holiday,
  holidayModalTypes
} from "~community/people/types/HolidayTypes";
import { getFormattedDate } from "~community/people/utils/holidayUtils/commonUtils";

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
  const holidayDataSort = usePeopleStore(
    (state) => state.holidayDataParams.sortOrder
  );

  const { data: session } = useSession();

  const isAdmin = session?.user?.roles?.includes(AdminTypes.PEOPLE_ADMIN);

  const { setIsHolidayModalOpen, setHolidayModalType } = usePeopleStore(
    (state) => state
  );

  const [selectedHolidays, setSelectedHolidays] = useState<number[]>([]);

  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [sortEl, setSortEl] = useState<null | HTMLElement>(null);
  const translateText = useTranslator("peopleModule", "holidays");
  const sortByOpen = sortOpen && Boolean(sortEl);
  const sortId = sortByOpen ? "sortBy-popper" : undefined;

  const listInnerRef = useRef<HTMLDivElement>();
  const supportsPassive = testPassiveEventSupport();

  const {
    setIndividualDeleteId,
    selectedDeleteIds,
    setSelectedDeleteIds,
    setSelectedYear,
    selectedYear
  } = usePeopleStore((state) => state);
  const [selectedOption, setSelectedOption] = useState<OptionType>({
    id: 1,
    name: selectedYear
  });

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

  const handleSortClose = (): void => {
    setSortOpen(false);
  };

  const handleSortClick = (event: MouseEvent<HTMLElement>): void => {
    setSortEl(event.currentTarget);
    setSortOpen((previousOpen) => !previousOpen);
  };
  const setOptionName = (year: string): void => {
    setSelectedYear(year);
  };
  const scrollToTop = () => {
    if (listInnerRef.current) {
      listInnerRef.current.scrollTop = 0;
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
  const renderSortBy = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "0.625rem"
        }}
      >
        <Box>
          <Button
            label={`Sort : ${
              holidayDataSort === "ASC" ? "Jan to Dec" : "Dec to Jan"
            }`}
            buttonStyle={ButtonStyle.TERTIARY}
            styles={{
              border: "0.0625rem solid",
              borderColor: "grey.500",
              fontWeight: "400",
              fontSize: "0.875rem",
              py: "0.5rem",
              px: "1rem"
            }}
            endIcon={
              holidayData?.length !== 0 ? (
                <Icon name={IconName.DROPDOWN_ARROW_ICON} />
              ) : null
            }
            onClick={handleSortClick}
            disabled={holidayData?.length === 0}
            aria-describedby={sortId}
          />
          <HolidayDataMenu
            anchorEl={sortEl}
            handleClose={handleSortClose}
            position="bottom-start"
            menuType={MenuTypes.SORT}
            id={sortId}
            open={sortOpen}
            scrollToTop={scrollToTop}
          />
        </Box>

        <ItemSelector
          options={options}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          setOptionName={setOptionName}
          popperStyles={{ width: "150px" }}
        />
      </Box>
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
          styles={{
            fontWeight: "400",
            fontSize: "0.875rem",
            py: "0.5rem",
            px: "1rem"
          }}
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
  };

  return (
    <Box
      sx={{
        mt: "1.5rem",
        backgroundColor: theme.palette.grey[100],
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.5rem",
        border: "none",
        gap: "0.125rem"
      }}
    >
      <Box sx={{ zIndex: ZIndexEnums.MIN }} ref={listInnerRef}>
        <Table
          tableHeaders={tableHeaders}
          tableRows={transformToTableRows()}
          actionRowOneLeftButton={renderSortBy()}
          actionRowOneRightButton={
            holidayData && holidayData?.length > 0 && isAdmin
              ? renderDeleteAllButton()
              : null
          }
          selectedRows={selectedHolidays}
          skeletonRows={5}
          handleRowCheck={handleCheckBoxClick}
          isLoading={isFetching && !isFetchingNextPage}
          isDataAvailable={false}
          emptyDataDescription={translateText(["noHolidayDes"])}
          emptyDataTitle={translateText(["noHolidaysTitle"], {
            selectedYear: holidaySelectedYear
          })}
          emptyScreenButtonText={isAdmin && translateText(["addHolidaysBtn"])}
          tableContainerStyles={{ border: 0, maxHeight: "32rem" }}
          tableHeaderTypographyStyles={{
            paddingLeft: isAdmin ? "0rem" : "1rem"
          }}
          tableRowCellStyles={{ paddingLeft: isAdmin ? "0rem" : "1rem" }}
          tableRowStyles={{ paddingLeft: isAdmin ? "0rem" : "1rem" }}
          onEmptyScreenBtnClick={AddHolidayButtonClick}
          isPaginationEnabled={false}
          isCheckboxSelectionEnabled={isAdmin}
          isSelectAllCheckboxEnabled={holidayData?.length === 0 ? false : true}
          actionColumnIconBtnRight={
            isAdmin
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
          tableHeaderCellStyles={{ paddingLeft: "0rem" }}
        />
      </Box>
    </Box>
  );
};

export default HolidayTable;

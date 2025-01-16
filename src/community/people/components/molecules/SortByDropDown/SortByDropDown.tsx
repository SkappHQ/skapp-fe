import { Stack } from "@mui/material";
import { MouseEvent, MutableRefObject, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import ItemSelector from "~community/common/components/molecules/ItemSelector/ItemSelector";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import {
  OptionType,
  SortOrderTypes
} from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import { currentYear, options } from "~community/common/utils/dateTimeUtils";
import HolidayDataMenu from "~community/people/components/molecules/HolidayDataMenu/HolidayDataMenu";
import { usePeopleStore } from "~community/people/store/store";
import { holiday } from "~community/people/types/HolidayTypes";

import { styles } from "./styles";

interface Props {
  holidayData: holiday[] | undefined;
  listInnerRef: MutableRefObject<HTMLDivElement | undefined>;
}

const SortByDropDown = ({ holidayData, listInnerRef }: Props) => {
  const classes = styles();

  const { selectedYear, setSelectedYear, holidayDataSort } = usePeopleStore(
    (state) => ({
      selectedYear: state.selectedYear,
      setSelectedYear: state.setSelectedYear,
      holidayDataSort: state.holidayDataParams.sortOrder
    })
  );

  const [sortEl, setSortEl] = useState<null | HTMLElement>(null);
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<OptionType>({
    id: 1,
    name: selectedYear
  });

  const sortByOpen = sortOpen && Boolean(sortEl);
  const sortId = sortByOpen ? "sortBy-popper" : undefined;

  useEffect(() => {
    setSelectedYear(currentYear.toString());
  }, [currentYear]);

  const scrollToTop = () => {
    if (listInnerRef.current) {
      listInnerRef.current.scrollTop = 0;
    }
  };

  const handleSortClose = (): void => {
    setSortOpen(false);
  };

  const handleSortClick = (event: MouseEvent<HTMLElement>): void => {
    setSortEl(event.currentTarget);
    setSortOpen((previousOpen) => !previousOpen);
  };

  return (
    <Stack sx={classes.wrapper}>
      <Stack>
        <Button
          label={`Sort : ${
            holidayDataSort === SortOrderTypes.ASC ? "Jan to Dec" : "Dec to Jan"
          }`}
          buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
          size={ButtonSizes.MEDIUM}
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
      </Stack>
      <ItemSelector
        options={options}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        setOptionName={(year: string) => setSelectedYear(year)}
        popperStyles={{ width: "9.375rem" }}
      />
    </Stack>
  );
};

export default SortByDropDown;

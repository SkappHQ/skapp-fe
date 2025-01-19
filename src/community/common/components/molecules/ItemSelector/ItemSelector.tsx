import { Box } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { JSX, MouseEvent, useEffect, useState } from "react";

import DropDownArrowIcon from "~community/common/assets/Icons/DropDownArrowIcon";
import Button from "~community/common/components/atoms/Button/Button";
import SortRow from "~community/common/components/atoms/SortRow/SortRow";
import Popper from "~community/common/components/molecules/Popper/Popper";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { usePeopleStore } from "~community/people/store/store";

interface OptionType {
  id: number;
  name: string;
}

interface Props {
  options: OptionType[];
  selectedOption: OptionType;
  setSelectedOption: (option: OptionType) => void;
  setOptionName: (name: string) => void;
  popperStyles?: Record<string, string>;
}

const ItemSelector = ({
  options,
  selectedOption,
  setSelectedOption,
  setOptionName,
  popperStyles
}: Props): JSX.Element => {
  const theme: Theme = useTheme();

  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { selectedYear } = usePeopleStore((state) => state);

  const closeMenu = (): void => {
    setAnchorEl(null);
    setShowOverlay(false);
  };

  const handleOptionSelect = (option: OptionType): void => {
    setSelectedOption(option);
    setOptionName(option.name);
    closeMenu();
  };

  useEffect(() => {
    const matchingOption = options.find(
      (option) => option.name === selectedYear
    );

    if (matchingOption) {
      setSelectedOption(matchingOption);
    }
  }, [selectedYear, options, setSelectedOption]);

  return (
    // TODO: move styles to styles.ts
    <>
      <Box>
        <Button
          label={selectedOption.name}
          buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
          size={ButtonSizes.MEDIUM}
          endIcon={<DropDownArrowIcon />}
          onClick={(event: MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
            setShowOverlay(true);
          }}
        />
      </Box>
      <Popper
        anchorEl={anchorEl}
        open={Boolean(showOverlay)}
        position="bottom-end" // TODO: Use enums
        handleClose={closeMenu}
        id="popper"
        ariaLabel="Team Selector"
        containerStyles={popperStyles}
      >
        <Box
          sx={{
            backgroundColor: "common.white",
            boxShadow: `0rem .55rem 1.25rem ${theme.palette.grey[300]}`
          }}
        >
          {options.map((option: OptionType) => (
            <SortRow
              key={option.id}
              text={option.name}
              selected={selectedOption.id === option.id}
              onClick={() => handleOptionSelect(option)}
            />
          ))}
        </Box>
      </Popper>
    </>
  );
};

export default ItemSelector;

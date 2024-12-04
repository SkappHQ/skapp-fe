import { Box } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { JSX, MouseEvent, useState } from "react";

import DropDownArrowIcon from "~community/common/assets/Icons/DropDownArrowIcon";
import Button from "~community/common/components/atoms/Button/Button";
import SortRow from "~community/common/components/atoms/SortRow/SortRow";
import Popper from "~community/common/components/molecules/Popper/Popper";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";

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

  const closeMenu = (): void => {
    setAnchorEl(null);
    setShowOverlay(false);
  };

  const handleOptionSelect = (option: OptionType): void => {
    setSelectedOption(option);
    setOptionName(option.name);
    closeMenu();
  };

  return (
    <>
      <Box>
        <Button
          label={selectedOption.name}
          buttonStyle={ButtonStyle.TERTIARY}
          styles={{
            border: ".0625rem solid",
            borderColor: "grey.500",
            fontWeight: "400",
            fontSize: ".875rem",
            py: ".5rem",
            px: "1rem",
            width: "6.25rem"
          }}
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
        position="bottom-end"
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

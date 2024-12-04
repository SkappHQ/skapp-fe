import { Box } from "@mui/material";
import { MouseEvent, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import MenuItem from "~community/common/components/atoms/MenuItem/MenuItem";
import Popper from "~community/common/components/molecules/Popper/Popper";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { StyleProps } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

type Props<T> = {
  title: string;
  onItemClick: (event: MouseEvent<HTMLElement>, item: T) => void;
  items: T[];
  disabled?: boolean;
  selectedItem: T;
  displayKey?: keyof T;
  dropdownBtnStyles?: StyleProps;
  textStyles?: StyleProps;
  wrapperStyles?: StyleProps;
  position?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
};

const Dropdown = <T extends string | { [key: string]: any }>({
  title,
  items,
  onItemClick,
  disabled = false,
  selectedItem,
  displayKey,
  dropdownBtnStyles,
  textStyles,
  wrapperStyles,
  position = "bottom-start"
}: Props<T>) => {
  const classes = styles();

  const [popperOpen, setPopperOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleItemClick = (event: MouseEvent<HTMLElement>, item: T): void => {
    setAnchorEl(event.currentTarget);
    setPopperOpen((previousOpen) => !previousOpen);
    onItemClick(event, item);
  };

  const handleOpenClick = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
    setPopperOpen((previousOpen) => !previousOpen);
  };

  const getItemText = (item: T): string => {
    if (typeof item === "string") {
      return item;
    } else if (displayKey && typeof item[displayKey] === "string") {
      return item[displayKey] as string;
    }
    return "";
  };

  return (
    <Box sx={mergeSx([classes.wrapper, wrapperStyles])}>
      <Button
        label={title}
        buttonStyle={ButtonStyle.TERTIARY}
        styles={{
          ...classes.dropdownBtn,
          ...dropdownBtnStyles
        }}
        endIcon={
          !disabled ? <Icon name={IconName.DROPDOWN_ARROW_ICON} /> : null
        }
        onClick={handleOpenClick}
        disabled={disabled}
        aria-describedby="dropdown-popper"
      />
      <Popper
        anchorEl={anchorEl}
        open={popperOpen}
        position={position}
        menuType={MenuTypes.SORT}
        id="dropdown-popper"
      >
        <Box sx={{ backgroundColor: "common.white" }}>
          {items.map((item, key) => (
            <MenuItem
              key={key}
              text={getItemText(item)}
              selected={item === selectedItem}
              onClick={(event) => {
                handleItemClick(event, item);
              }}
              id={`selectable-item-${key}`}
            />
          ))}
        </Box>
      </Popper>
    </Box>
  );
};

export default Dropdown;

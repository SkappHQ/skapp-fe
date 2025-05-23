import { Typography } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import { ChangeEvent, FC, useEffect, useState } from "react";

import { IconName } from "~community/common/types/IconTypes";
import {
  mergeSx,
  removeInvalidEmailSearchCharacters,
  removeSpecialCharacters
} from "~community/common/utils/commonUtil";

import Icon from "../../atoms/Icon/Icon";
import styles from "./styles";

interface Props {
  placeHolder?: string;
  fullWidth?: boolean;
  setSearchTerm?: (value: string) => void;
  value?: string | null;
  label?: string;
  labelStyles?: SxProps;
  searchBoxStyles?: SxProps;
  paperStyles?: SxProps;
  autoFocus?: boolean;
  name?: string;
  "data-testid"?: string;
  isSearchIconVisible?: boolean;
}

const SearchBox: FC<Props> = ({
  placeHolder = "Search",
  fullWidth = true,
  setSearchTerm,
  value = "",
  label,
  labelStyles,
  searchBoxStyles,
  paperStyles,
  autoFocus = false,
  name = "search",
  "data-testid": testId,
  isSearchIconVisible = true
}) => {
  const theme: Theme = useTheme();

  const classes = styles(theme);
  const [searchValue, setSearchValue] = useState<string | null>(value);
  const emailAllowedSearchNames = ["contactSearch", "envelopeSearch"];
  const allowEmailCharacters = emailAllowedSearchNames.includes(name);

  useEffect(() => {
    if (value) {
      if (allowEmailCharacters) {
        setSearchValue(removeInvalidEmailSearchCharacters(value, ""));
      } else {
        setSearchValue(removeSpecialCharacters(value, ""));
      }
    }
  }, [value, name, allowEmailCharacters]);

  const searchHandler = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    const trimmedValue = allowEmailCharacters
      ? removeInvalidEmailSearchCharacters(e.target.value?.trimStart(), "")
      : removeSpecialCharacters(e.target.value?.trimStart(), "");
    setSearchValue(trimmedValue);

    if (setSearchTerm) {
      setSearchTerm(
        allowEmailCharacters
          ? removeInvalidEmailSearchCharacters(e.target.value?.trim(), "")
          : removeSpecialCharacters(e.target.value?.trim(), "")
      );
    }
  };

  return (
    <>
      {label && (
        <Typography lineHeight={1.5} sx={mergeSx([classes.label, labelStyles])}>
          {label}
        </Typography>
      )}
      <Paper elevation={0} sx={mergeSx([classes.paper, paperStyles])}>
        <InputBase
          sx={mergeSx([classes.inputBase, searchBoxStyles])}
          placeholder={placeHolder}
          inputProps={{
            "aria-label": "search google maps",
            "data-testid": testId
          }}
          fullWidth={fullWidth}
          onChange={searchHandler}
          value={searchValue}
          autoFocus={autoFocus}
          name={name}
          autoComplete="off"
        />
        {isSearchIconVisible && <Icon name={IconName.SEARCH_ICON} />}
      </Paper>
    </>
  );
};

export default SearchBox;

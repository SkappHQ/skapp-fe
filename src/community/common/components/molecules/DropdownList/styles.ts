import { Theme } from "@mui/material";

export const styles = (theme: Theme) => ({
  componentStyle: {
    display: "flex",
    flexDirection: "column"
  },

  labelContainerStyle: {
    paddingRight: "0.875rem"
  },

  labelStyle: (isDisabled: boolean, error: boolean) => ({
    fontWeight: 500,
    color: isDisabled
      ? theme.palette.text.disabled
      : error
        ? theme.palette.error.contrastText
        : "common.black",
    width: "100%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  }),

  paperStyle: (
    error: boolean,
    theme: Theme,
    errorFocusOutlineNeeded: boolean
  ) => ({
    bgcolor: error ? theme.palette.error.light : "grey.100",
    mt: "0.5rem",
    height: "3rem",
    borderRadius: "0.5rem",
    overflow: "hidden",
    display: "flex",
    zIndex: 1,
    border: error
      ? `${theme.palette.error.contrastText} 0.0625rem solid`
      : "none",
    ".MuiOutlinedInput-notchedOutline": {
      border: "none"
    },
    ".Mui-focused .MuiOutlinedInput-notchedOutline": {
      zIndex: 1,
      border:
        error && errorFocusOutlineNeeded
          ? `${theme.palette.error.contrastText} 0.0625rem solid`
          : "none"
    }
  }),

  selectStyle: (theme: Theme, isDisabled: boolean, readOnly: boolean) => ({
    flex: 1,
    "&& .MuiInputBase-input": {
      p: "0.7813rem 1rem",
      zIndex: 99999,
      color: theme.palette.grey[700],
      cursor: isDisabled || readOnly ? "default" : "pointer"
    },
    "&& .MuiInputBase-input::placeholder": {
      color: theme.palette.grey[700],
      opacity: 1
    }
  }),

  placeholderStyle: {
    color: theme.palette.grey[600],
    fontWeight: 400,
    opacity: 1,
    font: "inherit"
  },

  menuItemStyle: {
    py: ".625rem",
    px: "1rem",
    minWidth: "13.75rem",
    display: "flex",
    justifyContent: "space-between",
    borderRadius: "0.5rem"
  },

  addNewClickBtnStyle: {
    display: "flex",
    flexDirection: "row",
    margin: "auto",
    gap: "0.5rem",
    height: "3rem",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: "-0.5rem",
    cursor: "pointer"
  },

  errorTextStyle: {
    color: theme.palette.error.contrastText,
    mt: "0.5rem",
    lineHeight: "1rem"
  }
});

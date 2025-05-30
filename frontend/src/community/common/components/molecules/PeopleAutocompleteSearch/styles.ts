import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  wrapper: {
    width: "100%"
  },
  label: {
    fontWeight: "500",
    fontSize: "1rem",
    mb: "0.625rem"
  },
  asterisk: {
    color: theme.palette.error.contrastText
  },
  chip: {
    cursor: "pointer",
    maxWidth: "fit-content"
  },
  error: {
    color: theme.palette.error.contrastText,
    mt: "0.5rem"
  }
});

export default styles;

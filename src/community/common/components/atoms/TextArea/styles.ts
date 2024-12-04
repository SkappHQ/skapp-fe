import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  wrapper: {
    gap: "0.5rem",
    width: "100%"
  },
  container: {
    gap: "0.75rem",
    width: "100%"
  },
  asterisk: {
    color: theme.palette.error.contrastText
  },
  field: {
    flexDirection: "row",
    backgroundColor: theme.palette.grey[100],
    borderRadius: "0.5rem",
    padding: "0.75rem",
    gap: "0.5rem",
    width: "calc(100% - 0.0625rem)", // TODO: Remove this when the issue is fixed
    "&:focus-within": {
      outline: `0.0625rem solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.secondary.main
    }
  },
  error: { color: theme.palette.error.contrastText }
});

export default styles;

import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

export const styles = (theme: Theme): StyleProps => ({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "36.625rem",
    borderWidth: "0.0625rem",
    borderStyle: "solid",
    borderColor: theme.palette.grey.A100,
    background: theme.palette.grey[50],
    cursor: "pointer",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    gap: "1rem"
  },
  iconWrapper: {
    height: "1.5rem",
    width: "1.5rem",
    alignItems: "center",
    justifyItems: "center"
  },
  contentWrapper: {
    flexDirection: "column",
    alignItems: "flex-start"
  }
});

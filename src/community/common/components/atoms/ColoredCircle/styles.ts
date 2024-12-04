import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

export const styles = (theme: Theme, color: string): StyleProps => ({
  container: {
    width: "3.625rem",
    height: "3.625rem",
    backgroundColor: `${color}`,
    borderRadius: "50%",
    marginX: "0.375rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer"
  }
});

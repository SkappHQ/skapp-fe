import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: "24.4375rem",
    border: "none"
  },
  container: {
    width: "30.75rem",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: "1rem"
  },
  title: {
    fontWeight: 700
  },
  description: {
    color: theme.palette.grey[700]
  },
  buttonStyles: {
    marginBottom: "1rem"
  }
});

export default styles;

import { type Theme } from "@mui/material";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { type StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  wrapper: {
    zIndex: ZIndexEnums.POPOVER
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.625rem"
  },
  filterBtn: {
    border: "0.0625rem solid",
    borderColor: theme.palette.grey[500],
    alignItems: "center",
    color: theme.palette.common.black,
    height: "2.625rem"
  },
  popperContainer2: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: "0.75rem",
    width: "40rem",
    backgroundColor: theme.palette.background.paper
  }
});

export default styles;

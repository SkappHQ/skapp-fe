import { type Theme } from "@mui/material";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { type StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  title: {
    color: theme.palette.common.black,
    fontSize: "0.875rem",
    fontWeight: "600",
    lineHeight: "1.3125rem"
  },
  wrapper: {
    zIndex: ZIndexEnums.POPOVER
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.625rem"
  },
  firstColumn: {
    background: theme.palette.text.whiteText,
    p: 2,
    borderRadius: "1rem"
  },
  firstColumnList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  popperContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: "0.75rem",
    width: "22rem",
    backgroundColor: theme.palette.background.paper
  },
  popperBody: {
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "0.75rem"
  },
  label: {
    whiteSpace: "nowrap"
  },
  filterItem: {
    flexDirection: "row",
    gap: "0.5rem",
    border: "0.0625rem solid",
    borderColor: theme.palette.grey[500],
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.secondary,
    "&:hover": {
      borderColor: theme.palette.grey[500],
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.text.secondary
    }
  },
  popperFooter: {
    flexDirection: "row",
    gap: "0.75rem"
  },
  popperButtons: {
    width: "20.5rem",
    height: "2.625rem"
  }
});

export default styles;

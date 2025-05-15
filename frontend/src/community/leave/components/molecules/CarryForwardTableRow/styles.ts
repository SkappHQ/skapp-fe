import { Theme } from "@mui/material/styles";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";

export const carryForwardTableRowStyles = (theme: Theme) => ({
  rowContainer: {
    width: "max-content",
    height: "4.3rem",
    background: theme.palette.grey[50],
    borderWidth: "0.063rem 0rem",
    borderStyle: "solid",
    borderColor: theme.palette.grey[100],
    position: "relative",
    [theme.breakpoints.down("xl")]: {
      width: "max-content"
    }
  },
  stickyColumn: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    zIndex: ZIndexEnums.LEVEL_2,
    padding: "0.5rem 1rem",
    minWidth: "15rem",
    maxWidth: "15rem",
    background: theme.palette.grey[50],
    position: "sticky",
    left: 0,
    [theme.breakpoints.down("lg")]: {
      flex: 0.5,
      minWidth: "10rem",
      maxWidth: "10rem"
    },
    height: "100%",
    borderRightWidth: "0.063rem",
    borderRightStyle: "solid",
    borderRightColor: theme.palette.grey[500]
  },
  headerCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flex: 1,
    boxSizing: "border-box",
    padding: "0rem 1rem",
    width: "6.9rem",
    zIndex: ZIndexEnums.DEFAULT
  },
  label: {
    width: "100%",
    textAlign: "center",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
});

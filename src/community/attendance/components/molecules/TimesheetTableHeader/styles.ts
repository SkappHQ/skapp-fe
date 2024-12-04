import { Theme } from "@mui/material/styles";

import { TimesheetAnalyticsTabTypes } from "~community/attendance/enums/timesheetEnums";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";

export const timesheetTableHeaderStyles = (
  theme: Theme,
  selectedTab: string
) => ({
  headerContainer: {
    width:
      selectedTab === TimesheetAnalyticsTabTypes.WEEK ? "100%" : "max-content",
    height: "4.3rem",
    background: theme.palette.grey[100],
    borderWidth: "0.063rem 0rem",
    borderStyle: "solid",
    borderColor: theme.palette.grey[500],
    borderTopStyle: "none",
    position: "relative",
    [theme.breakpoints.down("xl")]: {
      width: "max-content"
    }
  },
  stickyColumn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1.1,
    padding: "0.5rem 1rem",
    minWidth: "15rem",
    maxWidth: "15rem",
    background: theme.palette.grey[100],
    position: "sticky",
    left: 0,
    zIndex: ZIndexEnums.LEVEL_2,
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
  columnText: {
    letterSpacing: "0.03em",
    color: theme.palette.text.secondary
  },
  headerCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: "6.5rem",
    zIndex: ZIndexEnums.DEFAULT,
    paddingTop: "0.75rem"
  },
  headerDateText: {
    letterSpacing: "0.03em",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  emojiChipContainer: {
    pr: "0.25rem",
    borderColor: theme.palette.grey[500]
  },
  emojiTitle: {
    fontSize: "0.625rem"
  }
});

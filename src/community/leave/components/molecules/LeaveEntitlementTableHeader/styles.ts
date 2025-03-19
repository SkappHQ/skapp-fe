import { Theme } from "@mui/material/styles";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";

const styles = (theme: Theme) => ({
  headerContainer: {
    width: "max-content",
    height: "4.3rem",
    background: theme.palette.grey[100],
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
    background: theme.palette.grey[100],
    position: "sticky",
    left: 0,
    zIndex: ZIndexEnums.LEVEL_2,
    [theme.breakpoints.down("lg")]: {
      flex: 0.5,
      minWidth: "10rem"
    },
    height: "100%"
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
    height: "100%",
    flex: 1,
    minWidth: "6.5rem",
    zIndex: ZIndexEnums.DEFAULT
  }
});

export default styles;

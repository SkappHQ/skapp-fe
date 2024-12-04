import { Theme } from "@mui/material/styles";

export const styles = (theme: Theme) => ({
  stackContainer: {
    width: "100%",
    overflowX: "auto",
    position: "relative",
    "&::-webkit-scrollbar": {
      height: "0.4em",
      backgroundColor: "transparent",
      outline: "none"
    },
    "&::-webkit-scrollbar-track": {
      marginLeft: "15rem",
      backgroundColor: "rgba(0,0,0,.1)"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.2)",
      borderRadius: "0.5rem"
    }
  },
  boxContainer: {
    maxWidth: "900px"
  },
  emptyScreenContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.palette.grey[100]
  },
  paginationContainer: {
    pb: "0.938rem",
    backgroundColor: theme.palette.grey[100],
    borderRadius: "0rem 0rem 0.5rem 0.5rem"
  },
  divider: {
    color: theme.palette.grey.A100
  },
  buttonStyles: {
    mt: "1rem",
    mr: "1rem",
    p: "0.75rem 1rem",
    width: "12rem",
    fontSize: "1rem",
    fontWeight: 400,
    backgroundColor: "white",
    [theme.breakpoints.down("lg")]: {
      p: ".9375rem",
      width: "9.563rem",
      fontSize: ".875rem"
    },
    ".MuiButton-endIcon": {
      "svg path": {
        fill: "none"
      }
    }
  }
});

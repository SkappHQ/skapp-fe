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
      borderRadius: "2px"
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
    color: theme.palette.grey.A100,
    my: "1rem"
  },
  buttonStyles: {
    mt: "1rem",
    mr: "1rem",
    ".MuiButton-endIcon": {
      "svg path": {
        fill: "none"
      }
    }
  }
});

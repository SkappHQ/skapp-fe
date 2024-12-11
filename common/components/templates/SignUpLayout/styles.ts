import { Theme } from "@mui/material";

export const styles = (theme: Theme, isSmallScreen: boolean) => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.palette.background.default
  },
  contentSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    margin: {
      xs: theme.spacing(2),
      sm: theme.spacing(4),
      md: "5.5625rem 5.1875rem 5.5625rem 5.5rem"
    },
    alignItems: isSmallScreen ? "center" : "flex-start",
    padding: 0,
    maxWidth: {
      xs: "100%",
      sm: "90%",
      md: "60%"
    },
    [theme.breakpoints.down("md")]: {
      alignSelf: "center"
    }
  },
  headerContainer: {
    marginBottom: theme.spacing(4),
    width: "100%"
  },
  header: {
    marginBottom: theme.spacing(1),
    fontWeight: "bold"
  },
  button: {
    marginTop: "0.75rem",
    width: "39.1875rem",
    height: "4rem",
    minWidth: "39.1875rem"
  },
  imageContainer: {
    flex: "0 0 44.5625rem",
    display: isSmallScreen ? "none" : "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh"
  },
  signInText: {
    width: "39.1875rem",
    marginTop: "1.5rem",
    marginBottom: "5.5625rem"
  }
});

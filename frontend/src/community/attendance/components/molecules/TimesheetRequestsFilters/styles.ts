import { Theme } from "@mui/material";

const styles = (theme: Theme) => ({
  stackContainer: {
    pb: "1.25rem",
    backgroundColor: theme.palette.grey[100],
    pt: "1.25rem",
    px: "0.625rem",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem"
  },
  fontStyles: {
    pr: "1rem"
  },
  iconButtonStyles: {
    border: "0.0625rem solid",
    borderColor: "grey.500",
    bgcolor: theme.palette.grey[100],
    p: "0.625rem 1.25rem",
    transition: "0.2s ease",
    "&:hover": {
      boxShadow: `inset 0 0 0 0.125rem ${theme.palette.grey[500]}`
    }
  }
});

export default styles;

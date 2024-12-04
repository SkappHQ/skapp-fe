import { Theme } from "@mui/material";

const styles = (theme: Theme) => ({
  label: {
    fontWeight: 500,
    color: theme.palette.common.black,
    mb: "0.5rem"
  },
  paper: {
    p: "0.5rem 0.9375rem",
    display: "flex",
    alignItems: "center",
    background: theme.palette.grey[100],
    borderRadius: "0.5rem"
  },
  inputBase: {
    flex: 1,
    "& input::placeholder": {
      fontSize: "1rem"
    }
  }
});

export default styles;

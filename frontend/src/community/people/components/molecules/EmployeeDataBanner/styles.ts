import { SxProps } from "@mui/material";
import { type Theme } from "@mui/material";

const bannerStyles = (theme: Theme) => ({
  bannerContainerStyles: (
    styles?: Record<string, string> | SxProps
  ): SxProps<Theme> => ({
    mt: "1.5rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.secondary.main,
    padding: "0.5rem 1rem",
    ...styles
  }),
  bannerTextStyles: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: theme.palette.primary.dark
  },
  bannerPromptStyles: {
    fontSize: "0.75rem",
    fontWeight: 400,
    textDecoration: "underline",
    cursor: "pointer",
    color: theme.palette.primary.dark
  }
});

export default bannerStyles;

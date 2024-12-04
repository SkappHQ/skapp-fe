import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

export const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  "&.MuiDrawer-docked": {
    [theme.breakpoints.up("lg")]: {
      width: open ? "22.5rem" : "1rem",
      height: "100dvh",
      transition: "width 0.3s ease"
    }
  },
  "& .MuiDrawer-paper": {
    [theme.breakpoints.up("xs")]: {
      width: open ? "100%" : "0%",
      backgroundColor: theme.palette.grey[100],
      border: "none",
      overflowY: "visible",
      transition: "width 0.3s ease"
    },
    [theme.breakpoints.up("sm")]: {
      width: open ? "22.5rem" : "0rem"
    },
    [theme.breakpoints.up("lg")]: {
      width: open ? "22.5rem" : "1rem",
      "&:hover .MuiIconButton-root": {
        opacity: 1,
        visibility: "visible"
      }
    }
  }
}));

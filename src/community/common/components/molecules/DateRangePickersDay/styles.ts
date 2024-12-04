import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  pickersDay: {
    "&.Mui-full-day-holiday": {
      backgroundColor: theme.palette.grey[200]
    },
    "&.Mui-half-day-morning-holiday": {
      background: `linear-gradient(90deg, ${theme.palette.grey[200]} 50%, transparent 50%)`
    },
    "&.Mui-half-day-evening-holiday": {
      background: `linear-gradient(90deg, transparent 50%, ${theme.palette.grey[200]} 50%)`
    },
    "&.Mui-full-day-leave": {
      border: `0.125rem solid ${theme.palette.error.contrastText}`
    },
    "&.Mui-half-day-morning-leave": {
      borderLeft: `0.125rem solid ${theme.palette.error.contrastText}`
    },
    "&.Mui-half-day-evening-leave": {
      borderRight: `0.125rem solid ${theme.palette.error.contrastText}`
    },
    "&.Mui-user-selection": {
      backgroundColor: theme.palette.primary.dark
    },
    "&.Mui-full-day-range-selection": {
      backgroundColor: theme.palette.primary.main
    },
    "&.Mui-half-day-morning-range-selection": {
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 50%, transparent 50%)`
    },
    "&.Mui-half-day-evening-range-selection": {
      background: `linear-gradient(90deg, transparent 50%, ${theme.palette.primary.main} 50%)`
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.light
    }
  }
});

export default styles;

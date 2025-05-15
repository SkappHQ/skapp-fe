import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (): StyleProps => ({
  wrapper: {
    flexDirection: "column",
    gap: "1rem"
  },
  formWrapper: {
    flexDirection: { xs: "column", md: "row" },
    gap: { xs: "0.75rem", md: "1.75rem" }
  },
  calendarWrapper: {
    gap: "0.75rem"
  },
  textWrapper: {
    display: { xs: "none", md: "flex" },
    flexDirection: "row",
    alignContent: "center",
    gap: "0.5rem"
  },
  fieldWrapper: {
    flexDirection: "column",
    gap: "0.75rem",
    width: "100%"
  },
  btnWrapper: {
    flexDirection: "column",
    gap: "0.75rem"
  }
});

export default styles;

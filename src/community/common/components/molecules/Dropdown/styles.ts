import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (): StyleProps => ({
  wrapper: { width: "100%" },
  dropdownBtn: {
    border: "0.0625rem solid",
    borderColor: "grey.500",
    fontWeight: "400",
    fontSize: "0.875rem",
    py: "0.5rem",
    px: "1rem",
    color: "common.black",
    width: "6.5625rem",
    height: "2.125rem"
  }
});

export default styles;

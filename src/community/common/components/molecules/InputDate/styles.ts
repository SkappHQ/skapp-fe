import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (): StyleProps => ({
  labelWrapper: {
    paddingRight: "0.875rem",
    justifyContent: "space-between"
  },
  errorText: {
    marginTop: "0.3rem"
  },
  popper: {
    zIndex: ZIndexEnums.POPOVER,
    marginTop: "0.1875rem !important",
    marginBottom: "0.1875rem !important"
  }
});

export default styles;

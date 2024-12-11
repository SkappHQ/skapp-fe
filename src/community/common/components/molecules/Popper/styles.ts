import { ZIndexEnums } from "~community/common/enums/CommonEnums";

const styles = () => ({
  container: {
    borderRadius: ".75rem",
    overflow: "hidden"
  },
  wrapper: {
    outline: "none",
    zIndex: ZIndexEnums.POPUP
  }
});

export default styles;
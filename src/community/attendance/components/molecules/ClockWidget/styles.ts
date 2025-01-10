import { ZIndexEnums } from "~community/common/enums/CommonEnums";

const styles = () => ({
  container: {
    backgroundColor: "grey.100",
    padding: "1rem",
    borderRadius: "3.3125rem",
    zIndex: ZIndexEnums.DEFAULT,
    width: "fit-content"
  },
  timerContainer: (isDisabled: boolean) => ({
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? "none" : "auto",
    filter: isDisabled ? "grayscale(100%)" : "none"
  })
});

export default styles;

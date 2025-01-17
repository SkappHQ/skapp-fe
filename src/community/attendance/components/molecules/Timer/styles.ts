import { AttendanceSlotType } from "~community/attendance/types/attendanceTypes";
import { pulse } from "~community/attendance/utils/TimerPulseAnimation";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";

const styles = () => ({
  container: (status: AttendanceSlotType) => ({
    border: "1px solid #D4D4D8",
    borderRadius: "2.1875rem",
    zIndex: ZIndexEnums.DEFAULT,
    width: "fit-content",
    padding: "0.5rem",
    opacity: status === AttendanceSlotType.READY ? 0.5 : 1,
    pointerEvents:
      status === AttendanceSlotType.READY || status === AttendanceSlotType.END
        ? "none"
        : "auto",
    filter: status === AttendanceSlotType.READY ? "grayscale(100%)" : "none"
  }),
  timerComponent: (
    status: AttendanceSlotType,
    isAttendanceModalOpen: boolean
  ) => ({
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: "50%",
    backgroundColor:
      status === AttendanceSlotType.RESUME ||
      status === AttendanceSlotType.START
        ? "#62B794"
        : "#FDE047",
    animation:
      (status === AttendanceSlotType.RESUME ||
        status === AttendanceSlotType.START ||
        status === AttendanceSlotType.PAUSE) &&
      !isAttendanceModalOpen
        ? `${pulse} 1s infinite`
        : "none"
  }),
  textStyle: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 2
  }
});

export default styles;

import { AttendanceSlotType } from "~community/attendance/types/attendanceTypes";

const styles = () => ({
  buttonComponent: (status: AttendanceSlotType) => ({
    border: "none",
    borderRadius: "50%",
    width: "2rem",
    height: "2rem",
    cursor: "pointer",
    background:
      status === AttendanceSlotType.RESUME ||
      status === AttendanceSlotType.START
        ? "#FDE047"
        : "#62B794",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  })
});

export default styles;

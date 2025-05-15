import { ZIndexEnums } from "~community/common/enums/CommonEnums";

const styles = () => ({
  wrapper: {
    position: "sticky",
    top: 0,
    right: 0,
    backgroundColor: "common.white",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: {
      xs: "1.875rem 2rem",
      lg: "1.875rem 3rem"
    },
    boxSizing: "border-box",
    width: "100%",
    height: "min-content",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "1.5rem",
    zIndex: ZIndexEnums.APP_BAR
  },
  container: {
    flexDirection: "row",
    width: { xs: "calc(100% - 4.5rem)", lg: "100%" },
    justifyContent: "space-between"
  },
  clockInWrapper: {
    flexDirection: "row",
    height: "4.5rem",
    borderRadius: "3.3125rem"
  },
  userInfoPanelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: "0.75rem",
    height: "4.5rem",
    width: "auto",
    minWidth: { lg: "15.625rem" },
    maxWidth: { lg: "25rem" },
    padding: "1rem",
    borderRadius: "3.3125rem",
    backgroundColor: "grey.100"
  },
  userInfo: {
    display: { xs: "none", lg: "flex" },
    flexDirection: "column",
    alignItems: "flex-start",
    transition: "none"
  },
  name: {
    fontSize: "1.125rem",
    fontWeight: 700,
    lineHeight: "1.3613rem",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "12rem"
  },
  userRole: {
    fontSize: "0.8125rem",
    fontWeight: 400,
    lineHeight: "1.2188rem",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "12rem"
  },
  menuIconBtn: {
    display: { xs: "flex", lg: "none" }
  },
  appBarMenuWrapper: {
    zIndex: ZIndexEnums.APP_BAR,
    position: "fixed"
  }
});

export default styles;

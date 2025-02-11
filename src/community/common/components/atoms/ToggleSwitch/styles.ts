import { Theme } from "@mui/material/styles";

const styles = (theme: Theme) => ({
  container: () => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: "4px",
    gap: "4px",
    backgroundColor: theme.palette.grey[200],
    borderRadius: "58px"
  }),
  text: (selected?: boolean) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    height: "24px",
    borderRadius: "64px",
    padding: "4px 12px",
    fontWeight: 400,
    fontSize: "14px",
    color: selected ? "common.black" : theme.palette.grey[700],
    gap: "8px",
    userSelect: "none",
    mozUserSelect: "none",
    webkitUserSelect: "none",
    msUserSelect: "none",
    backgroundColor: selected
      ? theme.palette.grey[100]
      : theme.palette.grey[200]
  })
});
export default styles;

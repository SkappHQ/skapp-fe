import { Theme } from "@mui/material";

const styles = (theme: Theme) => ({
  wrapper: {
    display: "flex",
    height: "24.4375rem",
    border: "none",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    margin: "auto",
    textAlign: "center"
  },
  titleWrapper: (isIconTitleInline: boolean | undefined) => ({
    display: "flex",
    justifyContent: "center",
    flexDirection: isIconTitleInline ? "row" : "column",
    gap: isIconTitleInline ? theme.spacing(1) : 0,
    alignItems: "center"
  }),
  title: (isIconTitleInline: boolean | undefined) => ({
    fontWeight: 700,
    marginTop: isIconTitleInline ? 0 : "0.75rem"
  }),
  description: {
    color: theme.palette.grey[700],
    width: "30.75rem"
  },
  btnWrapper: {
    display: "flex",
    justifyContent: "center"
  },
  buttonStyles: {
    paddingX: "2.5rem",
    marginTop: "1.5rem"
  }
});

export default styles;

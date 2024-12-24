import { styled } from "@mui/material";

const StyledTextArea = styled("textarea")(({ theme }) => ({
  width: "100%",
  borderRadius: "0.5rem",
  border: "none",
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: "400",
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  backgroundColor: theme.palette.grey[100],
  height: "5rem",
  resize: "none",
  "&:focus": {
    color: theme.palette.primary.dark,
    border: "none",
    outline: "none"
  }
}));

export default StyledTextArea;

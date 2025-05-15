import { Box, CircularProgress } from "@mui/material";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";

const FullScreenLoader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: ZIndexEnums.MAX
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default FullScreenLoader;

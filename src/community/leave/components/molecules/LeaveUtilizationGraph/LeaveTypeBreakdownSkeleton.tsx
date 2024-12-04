import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Skeleton, Theme, Typography, useTheme } from "@mui/material";
import { Box, Stack, type SxProps } from "@mui/system";
import { JSX } from "react";

interface Props {
  styles?: SxProps;
}

const LeaveTypeBreakdownSkeleton = ({ styles }: Props): JSX.Element => {
  const theme: Theme = useTheme();
  const MonthSelector = () => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width={"100%"}
        px={"10px"}
        pt={"5px"}
      >
        <ArrowBackIos
          sx={{ color: theme.palette.grey[200], fontSize: "15px" }}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width={"100%"}
          px={"15px"}
        >
          {["Jan", "Feb", "March", "April", "May", "June", "July"].map(
            (month, index) => (
              <Typography
                key={index}
                component="span"
                sx={{ color: theme.palette.grey[200], fontSize: "15px" }}
              >
                {month}
              </Typography>
            )
          )}
        </Box>
        <ArrowForwardIos
          sx={{ color: theme.palette.grey[200], fontSize: "15px" }}
        />
      </Box>
    );
  };

  const BarChartSkeleton = () => {
    return (
      <Stack
        display={"flex"}
        direction={"column"}
        height={"180px"}
        width={"100%"}
        mx="auto"
      >
        <Box position="relative" height={"150px"} width={"100%"} mx="auto">
          {[...Array(7)].map((_, index) => (
            <Box
              key={index}
              position="absolute"
              left={0}
              right={0}
              height="1px"
              bgcolor={theme.palette.grey[200]}
              style={{ bottom: `${(index / 6.5) * 100}%` }}
            />
          ))}
          <Box
            display="flex"
            justifyContent="space-around"
            height="100%"
            alignItems="flex-end"
          >
            {[...Array(12)].map((_, groupIndex) => (
              <Box
                display="flex"
                key={groupIndex}
                flexDirection="row"
                justifyContent="space-between"
                width="92px"
                alignItems="flex-end"
                gap="4px"
              >
                <Skeleton
                  variant="rectangular"
                  width="40px"
                  height="148px"
                  animation="wave"
                  sx={{
                    borderRadius: "8px 8px 0 0",
                    backgroundColor: theme.palette.grey[200]
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <MonthSelector />
      </Stack>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        width: "100%",
        height: "265px",
        borderRadius: "12px",
        pt: "12px",
        pr: "24px",
        pb: "12px",
        pl: "24px",
        gap: "12px",
        ...styles
      }}
    >
      <Stack
        display={"flex"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Skeleton
          variant="rounded"
          height="23px"
          sx={{
            borderRadius: "12px",
            backgroundColor: theme.palette.grey[200]
          }}
          width="118px"
          animation={"wave"}
        />
        <Stack
          height="32px"
          sx={{
            borderRadius: "12px",
            backgroundColor: theme.palette.grey[200]
          }}
          direction={"row"}
          width="288px"
          justifyContent={"space-evenly"}
          alignItems={"center"}
        >
          <Skeleton
            variant="rounded"
            height="24px"
            sx={{
              borderRadius: "12px",
              backgroundColor: theme.palette.grey[100]
            }}
            width="75px"
            animation={"wave"}
          />
          <Skeleton
            variant="rounded"
            height="24px"
            sx={{
              borderRadius: "12px",
              backgroundColor: theme.palette.grey[100]
            }}
            width="75px"
            animation={"wave"}
          />
          <Skeleton
            variant="rounded"
            height="24px"
            sx={{
              borderRadius: "12px",
              backgroundColor: theme.palette.grey[100]
            }}
            width="56px"
            animation={"wave"}
          />
          <Skeleton
            variant="rounded"
            height="24px"
            sx={{
              borderRadius: "12px",
              backgroundColor: theme.palette.grey[100]
            }}
            width="56px"
            animation={"wave"}
          />
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        gap={"4px"}
        sx={{ ml: "5px", mt: "30px" }}
        justifyContent={"space-between"}
      >
        <Skeleton
          variant="rounded"
          height="170px"
          sx={{
            borderRadius: "6px",
            backgroundColor: theme.palette.grey[200],
            mr: "5px"
          }}
          width="6px"
          animation={"wave"}
        />
        <BarChartSkeleton />
      </Stack>
    </Box>
  );
};

export default LeaveTypeBreakdownSkeleton;

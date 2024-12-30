import { Box, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { DateTime } from "luxon";
import { FC } from "react";

import RightArrowIcon from "~community/common/assets/Icons/RightArrowIcon";
import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import MultipleSkeletons from "~community/common/components/molecules/Skeletons/MultipleSkeletons";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { theme } from "~community/common/theme/theme";
import { monthAbbreviations } from "~community/common/utils/commonUtil";
import { convertDateToFormat } from "~community/common/utils/dateTimeUtils";
import { useGetEmployeeTimeline } from "~community/people/api/PeopleApi";
import { TimelineDataType } from "~community/people/types/TimelineTypes";
import { getTimelineValues } from "~community/people/utils/peopleTimelineUtils";

import styles from "./styles";

interface Props {
  id: string | string[];
}

const PeopleTimeline: FC<Props> = ({ id }) => {
  const classes = styles(theme);
  const translateText = useTranslator("peopleModule", "editAllInfo");
  const translateTimelineText = useTranslator(
    "peopleModule",
    "peoples",
    "filters",
    "selectedFiltersFilterItems"
  );
  const isExtraLargeScreen: boolean = useMediaQuery(theme.breakpoints.up("xl"));
  const isXXLScreen: boolean = useMediaQuery(theme.breakpoints.up("2xl"));

  const { data: timeline } = useGetEmployeeTimeline(Number(id));

  const getGroupTitle = (date: string): string => {
    const originalDate = DateTime.fromISO(new Date(date).toISOString());

    const monthAbbreviation = originalDate?.monthShort;
    const day = originalDate?.day;

    return `${monthAbbreviation} ${day}`;
  };

  return (
    <>
      {/* {!timeline && !isLoading && (
        <EmptyScreen
          title="No employee timeline records available"
          description="This employee doesn't have any timeline records for the moment! It will be available once the resource profile is completed"
          my={10}
        />
      )} */}

      {false && (
        <MultipleSkeletons
          numOfSkeletons={5}
          height={"5rem"}
          styles={{ my: 1 }}
        />
      )}
      {timeline?.results?.map((data: TimelineDataType) => (
        <Stack
          key={`${data?.year ?? ""} ${data?.month ?? ""}`}
          sx={classes.outermostStack}
        >
          <Typography sx={classes.eventYearTypography}>
            {`${data?.year} ${monthAbbreviations[Number(data?.month) - 1]}`}
          </Typography>
          <Stack direction="column">
            {data?.employeeTimelineRecords.map((event, index) => {
              return (
                <>
                  {(event.previousValue === null ||
                    event.previousValue !== event.newValue) && (
                    <Stack key={event.id} sx={classes.eventStack}>
                      {isExtraLargeScreen && (
                        <Box
                          sx={{
                            ...classes.iconContainerBox,
                            justifyContent:
                              data?.employeeTimelineRecords?.length === 1
                                ? "center"
                                : index === 0
                                  ? "end"
                                  : data?.employeeTimelineRecords?.length -
                                        1 ===
                                      index
                                    ? "start"
                                    : "",
                            height: isExtraLargeScreen ? "4.75rem" : "6.875rem"
                          }}
                        >
                          {/* Line */}
                          {index !== 0 && (
                            <Divider
                              orientation="vertical"
                              sx={classes.iconTopLine}
                            />
                          )}
                          {/* Dot */}
                          <Box sx={classes.iconDot}></Box>
                          {/* Line */}
                          {data?.employeeTimelineRecords?.length - 1 !==
                            index && (
                            <Divider
                              orientation="vertical"
                              sx={classes.iconBottomLine}
                            />
                          )}
                        </Box>
                      )}
                      <Stack
                        direction={isExtraLargeScreen ? "row" : "column"}
                        sx={{
                          ...classes.eventContainerStack,
                          height: isExtraLargeScreen ? "4rem" : "6.375rem"
                        }}
                        alignItems={
                          isExtraLargeScreen ? "center" : "flex-start"
                        }
                        gap={
                          isExtraLargeScreen
                            ? isXXLScreen
                              ? "4.625rem"
                              : "0.625rem"
                            : "0.75rem"
                        }
                      >
                        <Stack
                          sx={{
                            ...classes.displayDateStack,
                            width: isExtraLargeScreen ? "9.375rem" : "100%"
                          }}
                        >
                          <Typography sx={classes.displayDateTypography}>
                            {getGroupTitle(event?.displayDate)}
                          </Typography>
                          <Typography sx={classes.lighterTextTypography}>
                            {convertDateToFormat(
                              new Date(event?.displayDate),
                              "hh:mm a"
                            )}
                          </Typography>
                          <Typography
                            sx={{
                              ...classes.eventTitleTypography,
                              marginLeft: "2rem",
                              display: isExtraLargeScreen ? "none" : "block"
                            }}
                          >
                            {event?.title}
                          </Typography>
                        </Stack>
                        <Stack sx={classes.eventDataStack}>
                          <Stack sx={{ flex: isExtraLargeScreen ? 1 : "none" }}>
                            <Typography
                              sx={{
                                ...classes.eventTitleTypography,
                                display: isExtraLargeScreen ? "block" : "none"
                              }}
                            >
                              {event?.title}
                            </Typography>
                          </Stack>
                          <Stack
                            sx={{
                              ...classes.eventNameStack,
                              justifyContent: isExtraLargeScreen
                                ? "center"
                                : "flex-start"
                            }}
                          >
                            {event?.previousValue && (
                              <BasicChip
                                label={getTimelineValues(
                                  event?.previousValue,
                                  translateTimelineText
                                )}
                                chipStyles={classes.basicChip}
                              />
                            )}
                            {event?.newValue && (
                              <>
                                <Box sx={classes.rightArrowBox}>
                                  {event?.previousValue && <RightArrowIcon />}
                                </Box>
                                <BasicChip
                                  label={getTimelineValues(
                                    event?.newValue,
                                    translateTimelineText
                                  )}
                                  chipStyles={{
                                    ...classes.basicChip,
                                    ...(event?.previousValue === null && {
                                      maxWidth: "none"
                                    }),
                                    ...(event?.previousValue === null && {
                                      "& .MuiChip-label": {
                                        maxWidth: "100%"
                                      }
                                    })
                                  }}
                                />
                              </>
                            )}
                          </Stack>
                          {event?.createdBy && (
                            <Stack sx={classes.eventCreatedByStack}>
                              <Typography sx={classes.lighterTextTypography}>
                                {translateText(["entryAdded"])}
                              </Typography>
                              <Typography sx={classes.createdByTypography}>
                                {translateText(["by"], {
                                  name: event?.createdBy
                                })}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  )}
                </>
              );
            })}
          </Stack>
        </Stack>
      ))}
    </>
  );
};

export default PeopleTimeline;

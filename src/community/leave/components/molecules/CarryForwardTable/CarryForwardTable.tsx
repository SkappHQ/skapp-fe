import { Box, Divider, Stack, Theme, useTheme } from "@mui/material";
import React, { ChangeEvent } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import Pagination from "~community/common/components/atoms/Pagination/Pagination";
import TableEmptyScreen from "~community/common/components/molecules/TableEmptyScreen/TableEmptyScreen";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useCommonStore } from "~community/common/stores/commonStore";
import { IconName } from "~community/common/types/IconTypes";
import { useLeaveStore } from "~community/leave/store/store";
import { downloadCarryForwardDataCSV } from "~community/leave/utils/CarryForwardUtils";

import CarryForwardSkeleton from "../CarryForwardSkeletion/CarryForwardSkeleton";
import CarryForwardHeaderFill from "../CarryForwardTableHeader/CarryForwardHeaderFill";
import CarryForwardTableHeader from "../CarryForwardTableHeader/CarryForwardTableHeader";
import CarryForwardTableRow from "../CarryForwardTableRow/CarryForwardTableRow";
import CarryForwardTableRowFill from "../CarryForwardTableRow/CarryForwardTableRowFill";
import { styles } from "./styles";

interface Props {
  isRecordLoading?: boolean;
  recordData: any[];
  leaveHeaders: string[];
  totalPage: number;
}

const CarryForwardTable: React.FC<Props> = ({
  isRecordLoading,
  recordData,
  leaveHeaders,
  totalPage
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);
  const translateTexts = useTranslator("leaveModule", "leaveCarryForward");

  const { isDrawerToggled } = useCommonStore((state) => ({
    isDrawerToggled: state.isDrawerExpanded
  }));
  const { leaveTypes, setCarryForwardPagination, carryForwardPagination } =
    useLeaveStore((state) => state);

  const handleExportToCsv = () => {
    downloadCarryForwardDataCSV(recordData, leaveTypes);
  };
  return (
    <>
      {isRecordLoading || !recordData ? (
        <CarryForwardSkeleton />
      ) : (
        <Stack sx={classes.stackContainer}>
          {!isDrawerToggled ? (
            <CarryForwardTableHeader leaveHeaders={leaveHeaders} />
          ) : (
            <>
              <Box sx={classes.boxContainer}>
                <CarryForwardTableHeader leaveHeaders={leaveHeaders} />
              </Box>
            </>
          )}
          <CarryForwardHeaderFill />
          {recordData?.length === 0 ? (
            <Box sx={classes.emptyScreenContainer}>
              <TableEmptyScreen
                title={translateTexts(["noTimeEntryTitle"])}
                description={translateTexts(["noTimeEntryDes"])}
              />
            </Box>
          ) : !isDrawerToggled ? (
            <Box sx={classes.boxContainer}>
              {recordData?.map((record: any) => (
                <>
                  <CarryForwardTableRowFill noOfRows={record?.length} />
                  <CarryForwardTableRow
                    key={record}
                    name={record?.employeeData?.name}
                    recordData={record?.entitlements}
                  />
                </>
              ))}
            </Box>
          ) : (
            <Box sx={classes.boxContainer}>
              {recordData?.map((record: any) => (
                <>
                  <CarryForwardTableRowFill noOfRows={record?.length} />
                  <CarryForwardTableRow
                    key={record?.employee?.employee?.employeeId}
                    name={record?.name}
                    recordData={record?.entitlements}
                  />
                </>
              ))}
            </Box>
          )}
        </Stack>
      )}
      {recordData?.length !== 0 && (
        <Stack sx={classes.paginationContainer}>
          <Divider sx={classes.divider} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Pagination
              totalPages={totalPage}
              currentPage={carryForwardPagination.page}
              onChange={(_event: ChangeEvent<unknown>, value: number) =>
                setCarryForwardPagination(value - 1)
              }
            />
            <Button
              buttonStyle={ButtonStyle.OUTLINE}
              label={translateTexts(["exportBtnTxt"])}
              endIcon={<Icon name={IconName.DOWNLOAD_ICON} />}
              isFullWidth={false}
              styles={classes.buttonStyles}
              onClick={handleExportToCsv}
            />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default CarryForwardTable;

import {
  Table as MuiTable,
  type SxProps,
  TableContainer,
  Theme
} from "@mui/material";
import { Box, Stack, useTheme } from "@mui/system";
import { ChangeEvent, FC, JSX } from "react";

import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { IconName } from "~community/common/types/IconTypes";

import TableBody from "./TableBody";
import TableHead from "./TableHead";
import TablePagination from "./TablePagination";
import styles from "./styles";

interface Props {
  tableHeaders: any[];
  tableRows: any[];
  actionRowOneLeftButton?: JSX.Element;
  actionRowTwoLeftButton?: JSX.Element;
  actionRowOneRightButton?: JSX.Element | null;
  actionRowTwoRightButton?: JSX.Element;
  isCheckboxSelectionEnabled?: boolean;
  isSelectAllCheckboxEnabled?: boolean;
  selectedRows?: number[];
  handleAllRowsCheck?: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRowCheck?: (id: number) => () => void;
  onRowClick?: (row: any) => void;
  isRowDisabled?: (row: any) => boolean;
  isPaginationEnabled?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPaginationChange?: (event: ChangeEvent<unknown>, value: number) => void;
  exportButtonText?: string;
  onExportButtonClick?: () => void;
  exportTooltipText?: string;
  tableContainerStyles?: SxProps;
  tableActionRowWrapperStyles?: SxProps;
  tableHeaderRowStyles?: SxProps;
  tableHeaderCellStyles?: SxProps;
  tableHeaderTypographyStyles?: SxProps;
  tableRowStyles?: SxProps;
  tableRowCellStyles?: SxProps;
  tableCheckboxStyles?: SxProps;
  paginationContainerStyles?: SxProps;
  exportButtonStyles?: SxProps;
  tableWrapperStyles?: SxProps;
  isLoading?: boolean;
  skeletonRows?: number;
  emptySearchTitle?: string;
  emptySearchDescription?: string;
  emptyDataTitle?: string;
  emptyDataDescription?: string;
  isDataAvailable?: boolean;
  emptyScreenButtonText?: string | boolean;
  onEmptyScreenBtnClick?: () => void;
  actionColumnIconBtnLeft?: {
    icon?: IconName;
    width?: string;
    height?: string;
    styles?: SxProps;
    onClick: (data: any) => void;
  } | null;
  actionColumnIconBtnRight?: {
    icon?: IconName;
    width?: string;
    height?: string;
    styles?: SxProps;
    OnClick: (data: any) => void;
  } | null;
  emptyScreenButtonType?: ButtonStyle;
}

const Table: FC<Props> = ({
  tableHeaders,
  tableRows,
  actionRowOneLeftButton,
  actionRowOneRightButton,
  actionRowTwoLeftButton,
  actionRowTwoRightButton,
  isCheckboxSelectionEnabled = false,
  isSelectAllCheckboxEnabled = false,
  selectedRows,
  handleAllRowsCheck,
  handleRowCheck,
  onRowClick,
  isRowDisabled = () => false,
  isPaginationEnabled = true,
  totalPages,
  currentPage,
  onPaginationChange,
  exportButtonText,
  onExportButtonClick,
  exportTooltipText,
  tableContainerStyles,
  tableActionRowWrapperStyles,
  tableHeaderRowStyles,
  tableHeaderCellStyles,
  tableHeaderTypographyStyles,
  tableRowStyles,
  tableRowCellStyles,
  tableCheckboxStyles,
  paginationContainerStyles,
  exportButtonStyles,
  tableWrapperStyles,
  isLoading,
  skeletonRows = 6,
  emptySearchTitle,
  emptySearchDescription,
  emptyDataTitle,
  emptyDataDescription,
  isDataAvailable,
  emptyScreenButtonText,
  onEmptyScreenBtnClick,
  actionColumnIconBtnLeft = null,
  actionColumnIconBtnRight = null,
  emptyScreenButtonType
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <Stack sx={classes.tableWrapperStyles(tableWrapperStyles)}>
      {(actionRowOneLeftButton ||
        actionRowTwoRightButton ||
        actionRowTwoLeftButton ||
        actionRowOneRightButton) && (
        <Stack
          sx={classes.tableActionRowWrapperStyles(
            actionRowOneLeftButton,
            actionRowOneRightButton,
            actionRowTwoRightButton,
            actionRowTwoRightButton,
            tableActionRowWrapperStyles
          )}
        >
          {(actionRowOneLeftButton || actionRowOneRightButton) && (
            <Stack sx={classes.tableActionRowStyles}>
              <Box>{actionRowOneLeftButton}</Box>
              <Box>{actionRowOneRightButton}</Box>
            </Stack>
          )}
          {(actionRowTwoLeftButton || actionRowTwoRightButton) && (
            <Stack sx={classes.tableActionRowStyles}>
              <Box>{actionRowTwoLeftButton}</Box>
              <Box>{actionRowTwoRightButton}</Box>
            </Stack>
          )}
        </Stack>
      )}

      <TableContainer sx={classes.tableContainerStyles(tableContainerStyles)}>
        <MuiTable stickyHeader sx={{ ...classes.tableStyles }}>
          <TableHead
            tableHeaders={tableHeaders}
            isCheckboxSelectionEnabled={isCheckboxSelectionEnabled}
            isSelectAllCheckboxEnabled={isSelectAllCheckboxEnabled}
            selectedRows={selectedRows}
            handleAllRowsCheck={handleAllRowsCheck}
            tableHeaderRowStyles={tableHeaderRowStyles}
            tableHeaderCellStyles={tableHeaderCellStyles}
            tableCheckboxStyles={tableCheckboxStyles}
            tableHeaderTypographyStyles={tableHeaderTypographyStyles}
            tableRows={tableRows}
            isRowDisabled={isRowDisabled}
            isActionColumnEnabled={
              actionColumnIconBtnLeft !== null ||
              actionColumnIconBtnRight !== null
            }
          />
          <TableBody
            tableRows={tableRows}
            isLoading={isLoading}
            skeletonRows={skeletonRows}
            emptySearchTitle={emptySearchTitle}
            emptySearchDescription={emptySearchDescription}
            emptyDataTitle={emptyDataTitle}
            emptyDataDescription={emptyDataDescription}
            isDataAvailable={isDataAvailable}
            emptyScreenButtonText={emptyScreenButtonText}
            onEmptyScreenBtnClick={onEmptyScreenBtnClick}
            isCheckboxSelectionEnabled={isCheckboxSelectionEnabled}
            selectedRows={selectedRows}
            handleRowCheck={handleRowCheck}
            isRowDisabled={isRowDisabled}
            onRowClick={onRowClick}
            tableRowStyles={tableRowStyles}
            tableRowCellStyles={tableRowCellStyles}
            tableCheckboxStyles={tableCheckboxStyles}
            tableHeaders={tableHeaders}
            isActionColumnEnabled={
              actionColumnIconBtnLeft !== null ||
              actionColumnIconBtnRight !== null
            }
            actionColumnIconBtnLeft={actionColumnIconBtnLeft}
            actionColumnIconBtnRight={actionColumnIconBtnRight}
            emptyScreenButtonType={emptyScreenButtonType}
          />
        </MuiTable>
      </TableContainer>

      {isPaginationEnabled && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPaginationChange={onPaginationChange}
          paginationContainerStyles={paginationContainerStyles}
          exportButtonText={exportButtonText}
          onExportButtonClick={onExportButtonClick}
          exportTooltipText={exportTooltipText}
          exportButtonStyles={exportButtonStyles}
          isDataAvailable={isDataAvailable}
        />
      )}
    </Stack>
  );
};

export default Table;

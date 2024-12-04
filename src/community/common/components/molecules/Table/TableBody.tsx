import {
  Checkbox,
  TableBody as MuiTableBody,
  type SxProps,
  TableCell,
  TableRow,
  Theme
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { FC } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import TableEmptyScreen from "~community/common/components/molecules/TableEmptyScreen/TableEmptyScreen";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { IconName } from "~community/common/types/IconTypes";

import TableSkeleton from "./TableSkeleton";
import styles from "./styles";

const DELETE_BUTTON_ICON_WIDTH = "10";
const DELETE_BUTTON_ICON_HEIGHT = "12";

interface Props {
  tableHeaders: any[];
  tableRows: any[];
  isCheckboxSelectionEnabled?: boolean;
  selectedRows?: number[];
  handleRowCheck?: (id: number) => () => void;
  onRowClick?: (row: any) => void;
  isRowDisabled?: (row: any) => boolean;
  tableRowStyles?: SxProps;
  tableRowCellStyles?: SxProps;
  tableCheckboxStyles?: SxProps;
  isLoading?: boolean;
  skeletonRows?: number;
  emptySearchTitle?: string;
  emptySearchDescription?: string;
  emptyDataTitle?: string;
  emptyDataDescription?: string;
  isDataAvailable?: boolean;
  emptyScreenButtonText?: string | boolean;
  onEmptyScreenBtnClick?: () => void;
  isActionColumnEnabled?: boolean;
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

const TableBody: FC<Props> = ({
  tableHeaders,
  tableRows,
  isLoading,
  skeletonRows = 4,
  emptySearchTitle,
  emptySearchDescription,
  emptyDataTitle,
  emptyDataDescription,
  isDataAvailable,
  emptyScreenButtonText,
  onEmptyScreenBtnClick,
  isCheckboxSelectionEnabled,
  selectedRows,
  handleRowCheck,
  isRowDisabled = () => false,
  onRowClick,
  tableRowStyles,
  tableRowCellStyles,
  tableCheckboxStyles,
  isActionColumnEnabled = false,
  actionColumnIconBtnLeft,
  actionColumnIconBtnRight,
  emptyScreenButtonType
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <MuiTableBody sx={classes.tableBodyStyles}>
      {isLoading ? (
        <TableRow sx={classes.loadingAndEmptyScreen}>
          <TableCell
            colSpan={
              tableHeaders?.length +
              (isActionColumnEnabled ? 1 : 0) +
              (isCheckboxSelectionEnabled ? 1 : 0)
            }
            sx={classes.loadingAndEmptyScreenCell}
          >
            <TableSkeleton rows={skeletonRows} />
          </TableCell>
        </TableRow>
      ) : tableRows?.length ? (
        tableRows.map((row) => (
          <TableRow
            key={row.id}
            onClick={
              isRowDisabled?.(row)
                ? undefined
                : onRowClick
                  ? () => onRowClick(row)
                  : undefined
            }
            sx={classes.tableRowStyles(isRowDisabled?.(row), tableRowStyles)}
          >
            {isCheckboxSelectionEnabled && (
              <TableCell
                onClick={(e) => e.stopPropagation()}
                sx={classes.tableRowCheckboxSelectionStyles(tableRowCellStyles)}
              >
                <Checkbox
                  checked={selectedRows?.includes(row.id) || false}
                  onChange={handleRowCheck && handleRowCheck(row.id)}
                  color="primary"
                  sx={classes.tableCheckboxStyles(tableCheckboxStyles)}
                  disabled={isRowDisabled ? isRowDisabled(row) : false}
                />
              </TableCell>
            )}

            {tableHeaders?.map((header) => (
              <TableCell
                key={header.id}
                sx={classes.tableRowCellStyles(tableRowCellStyles)}
              >
                {typeof row[header?.id] === "function" ? (
                  row[header?.id]()
                ) : (
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    {row[header?.id]}
                  </Box>
                )}
              </TableCell>
            ))}

            {isActionColumnEnabled && (
              <TableCell
                sx={classes.tableRowActionCellStyles(tableRowCellStyles)}
              >
                {actionColumnIconBtnLeft && (
                  <IconButton
                    icon={
                      <Icon
                        name={
                          actionColumnIconBtnLeft?.icon ?? IconName.EDIT_ICON
                        }
                        width={actionColumnIconBtnLeft?.width}
                        height={actionColumnIconBtnLeft?.height}
                      />
                    }
                    id={`${row.id}-action-column-icon-btn-left`}
                    hoverEffect={false}
                    buttonStyles={classes.iconBtnOneStyles(
                      actionColumnIconBtnLeft?.styles
                    )}
                    onClick={() =>
                      actionColumnIconBtnLeft?.onClick(row.actionData)
                    }
                  />
                )}
                {actionColumnIconBtnRight && (
                  <IconButton
                    icon={
                      <Icon
                        name={
                          actionColumnIconBtnRight?.icon ??
                          IconName.DELETE_BUTTON_ICON
                        }
                        width={
                          actionColumnIconBtnRight?.width ??
                          DELETE_BUTTON_ICON_WIDTH
                        }
                        height={
                          actionColumnIconBtnRight?.height ??
                          DELETE_BUTTON_ICON_HEIGHT
                        }
                      />
                    }
                    id={`${row.id}-action-column-icon-btn-right`}
                    hoverEffect={false}
                    buttonStyles={classes.iconBtnTwoStyles(
                      actionColumnIconBtnRight?.styles
                    )}
                    onClick={() =>
                      actionColumnIconBtnRight?.OnClick(row.actionData)
                    }
                  />
                )}
              </TableCell>
            )}
          </TableRow>
        ))
      ) : (
        <TableRow sx={classes.loadingAndEmptyScreen}>
          <TableCell
            colSpan={tableHeaders?.length + 2}
            padding="none"
            sx={{ border: "none" }}
          >
            {isDataAvailable ? (
              <TableEmptyScreen
                title={emptySearchTitle}
                description={emptySearchDescription}
              />
            ) : (
              <TableEmptyScreen
                title={emptyDataTitle}
                description={emptyDataDescription}
                buttonText={emptyScreenButtonText}
                onButtonClick={onEmptyScreenBtnClick}
                buttonStyle={emptyScreenButtonType}
              />
            )}
          </TableCell>
        </TableRow>
      )}
    </MuiTableBody>
  );
};

export default TableBody;

import { SxProps, TableCell, Theme, useTheme } from "@mui/material";
import { FC } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import { TableTypes } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

export interface TableBodyActionColumnProps {
  isEnabled?: boolean;
  actionBtns?: {
    left?: {
      iconName?: IconName;
      width?: string;
      height?: string;
      styles?: SxProps<Theme>;
      onClick: (data: any) => void;
    };
    right?: {
      iconName?: IconName;
      width?: string;
      height?: string;
      styles?: SxProps<Theme>;
      onClick: (data: any) => void;
    };
  };
}

export interface TableRowDataProps {
  isRowDisabled?: (row: any) => boolean;
  row: any;
}

const DELETE_BUTTON_ICON_WIDTH = "10";
const DELETE_BUTTON_ICON_HEIGHT = "12";

const TableBodyActionColumn: FC<
  TableTypes & TableBodyActionColumnProps & TableRowDataProps
> = ({ row, isEnabled = false, actionBtns, tableName, isRowDisabled }) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    isEnabled && (
      <TableCell
        sx={mergeSx([classes.tableBody.actionColumn.cell])}
        role="cell"
        aria-label={`${tableName}-table-body-action-column-cell-${row.id}`}
      >
        {actionBtns?.left && (
          <IconButton
            icon={
              <Icon
                name={actionBtns?.left?.iconName ?? IconName.EDIT_ICON}
                width={actionBtns?.left?.width}
                height={actionBtns?.left?.height}
              />
            }
            id={`${tableName}-table-body-action-column-icon-btn-left-${row.id}`}
            hoverEffect={false}
            buttonStyles={mergeSx([
              classes.tableBody.actionColumn.icons.left,
              actionBtns?.left.styles
            ])}
            disabled={isRowDisabled?.(row.id)}
            onClick={() => actionBtns?.left?.onClick(row.actionData)}
            ariaLabel={`table-action-column-edit-button-${row.id}`}
          />
        )}
        {actionBtns?.right && (
          <IconButton
            icon={
              <Icon
                name={
                  actionBtns?.right?.iconName ?? IconName.DELETE_BUTTON_ICON
                }
                width={actionBtns?.right?.width ?? DELETE_BUTTON_ICON_WIDTH}
                height={actionBtns?.right?.height ?? DELETE_BUTTON_ICON_HEIGHT}
              />
            }
            id={`${tableName}-table-body-action-column-icon-btn-right-${row.id}`}
            hoverEffect={false}
            buttonStyles={mergeSx([
              classes.tableBody.actionColumn.icons.right,
              actionBtns?.right.styles
            ])}
            disabled={isRowDisabled?.(row.id)}
            onClick={() => actionBtns?.right?.onClick(row.actionData)}
            ariaLabel={`table-action-column-delete-button-${row.id}`}
          />
        )}
      </TableCell>
    )
  );
};

export default TableBodyActionColumn;

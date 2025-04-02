import { SxProps, TableCell, TableRow, Theme, useTheme } from "@mui/material";
import { FC, JSX } from "react";

import { TableTypes } from "~community/common/types/CommonTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import TableSkeleton from "./TableSkeleton";
import styles from "./styles";

export interface TableBodyLoadingStateProps {
  headers: {
    id: string | number;
    label?: string;
    element?: JSX.Element;
  }[];
  loadingState?: {
    skeleton: {
      rows: number;
    };
    customStyles?: { row?: SxProps<Theme>; cell?: SxProps<Theme> };
  };
  isActionColumnEnabled?: boolean;
}

const TableBodyLoadingState: FC<TableTypes & TableBodyLoadingStateProps> = ({
  headers,
  loadingState = {
    skeleton: {
      rows: 4
    }
  },
  isActionColumnEnabled = false,
  tableName
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <TableRow
      sx={mergeSx([
        classes.tableBody.loadingState.row,
        loadingState?.customStyles?.row
      ])}
      role="row"
      aria-label={`${tableName}-table-body-loading-state-row`}
    >
      <TableCell
        colSpan={headers?.length + (isActionColumnEnabled ? 1 : 0)}
        sx={mergeSx([
          classes.tableBody.loadingState.cell,
          loadingState?.customStyles?.cell
        ])}
        role="cell"
        aria-label={`${tableName}-table-body-loading-state-cell`}
      >
        <TableSkeleton rows={loadingState?.skeleton?.rows} />
      </TableCell>
    </TableRow>
  );
};

export default TableBodyLoadingState;

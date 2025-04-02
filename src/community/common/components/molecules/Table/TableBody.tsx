import {
  Box,
  TableBody as MuiTableBody,
  SxProps,
  TableCell,
  TableRow,
  Theme,
  useTheme
} from "@mui/material";
import { FC } from "react";

import { TableEmptyScreenProps } from "~community/common/components/molecules/TableEmptyScreen/TableEmptyScreen";
import { mergeSx } from "~community/common/utils/commonUtil";

import { CommonTableProps } from "./Table";
import TableBodyActionColumn, {
  TableBodyActionColumnProps
} from "./TableBodyActionColumn";
import TableBodyEmptyState from "./TableBodyEmptyState";
import TableBodyLoadingState from "./TableBodyLoading";
import styles from "./styles";

export interface TableBodyProps {
  emptyState?: {
    noData?: TableEmptyScreenProps;
    noRecordsFound?: TableEmptyScreenProps;
    customStyles?: { row?: SxProps<Theme>; cell?: SxProps<Theme> };
  };
  loadingState?: {
    skeleton: {
      rows: number;
    };
    customStyles?: { row?: SxProps<Theme>; cell?: SxProps<Theme> };
  };
  customStyles?: {
    body?: SxProps<Theme>;
    row?: SxProps<Theme>;
    cell: {
      wrapper: SxProps<Theme>;
      container: SxProps<Theme>;
    };
    typography?: SxProps<Theme>;
  };
  actionColumn: TableBodyActionColumnProps;
  onRowClick?: (row: any) => void;
  isRowDisabled?: (row: any) => boolean;
}

const TableBody: FC<TableBodyProps & CommonTableProps> = ({
  isLoading,
  headers,
  rows,
  emptyState,
  loadingState,
  actionColumn,
  customStyles,
  isRowDisabled = () => false,
  onRowClick
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const handleTableRowClick = (row: any) => {
    if (isRowDisabled?.(row)) {
      return;
    }

    if (onRowClick) {
      onRowClick(row);
      return;
    }

    return;
  };

  return (
    <MuiTableBody sx={mergeSx([classes.tableBody.body, customStyles?.body])}>
      {isLoading ? (
        <TableBodyLoadingState
          headers={headers}
          loadingState={loadingState}
          isActionColumnEnabled={actionColumn.isEnabled}
        />
      ) : rows?.length ? (
        rows.map((row) => (
          <TableRow
            key={row.id}
            onClick={() => handleTableRowClick(row)}
            sx={mergeSx([
              classes.tableBody.row,
              {
                background: isRowDisabled?.(row)
                  ? theme.palette.grey[100]
                  : theme.palette.grey[50]
              },
              customStyles?.row
            ])}
          >
            {headers?.map((header) => (
              <TableCell
                key={header.id}
                sx={mergeSx([
                  classes.tableBody.cell.wrapper,
                  customStyles?.cell.wrapper
                ])}
              >
                {typeof row[header?.id] === "function" ? (
                  row[header?.id]()
                ) : (
                  <Box
                    sx={mergeSx([
                      classes.tableBody.cell.container,
                      customStyles?.cell.container
                    ])}
                  >
                    {row[header?.id]}
                  </Box>
                )}
              </TableCell>
            ))}

            <TableBodyActionColumn
              row={row}
              isEnabled={actionColumn.isEnabled}
              actionBtns={actionColumn.actionBtns}
            />
          </TableRow>
        ))
      ) : (
        <TableBodyEmptyState
          headers={headers}
          emptyState={emptyState}
          isDataAvailable={!!rows?.length}
        />
      )}
    </MuiTableBody>
  );
};

export default TableBody;

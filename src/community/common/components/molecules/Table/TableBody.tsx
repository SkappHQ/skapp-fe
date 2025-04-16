import {
  Box,
  Checkbox,
  TableBody as MuiTableBody,
  SxProps,
  TableCell,
  TableRow,
  Theme,
  useTheme
} from "@mui/material";
import { FC } from "react";

import { TableEmptyScreenProps } from "~community/common/components/molecules/TableEmptyScreen/TableEmptyScreen";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { TableTypes } from "~community/common/types/CommonTypes";
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
    customStyles?: { row?: SxProps<Theme>; cell?: SxProps<Theme> };
  };
  loadingState?: {
    skeleton?: {
      rows?: number;
    };
    customStyles?: { row?: SxProps<Theme>; cell?: SxProps<Theme> };
  };
  customStyles?: {
    body?: SxProps<Theme>;
    row?: {
      active?: SxProps<Theme>;
      disabled?: SxProps<Theme>;
    };
    cell?: {
      wrapper?: SxProps<Theme>;
      container?: SxProps<Theme>;
    };
    typography?: SxProps<Theme>;
  };
  actionColumn?: TableBodyActionColumnProps;
  onRowClick?: (row: any) => void;
}

const TableBody: FC<TableTypes & TableBodyProps & CommonTableProps> = ({
  isLoading,
  headers,
  rows,
  selectedRows,
  emptyState,
  loadingState,
  actionColumn,
  checkboxSelection,
  customStyles,
  isRowDisabled = () => false,
  onRowClick,
  tableName
}) => {
  const translateText = useTranslator(
    "commonAria",
    "components",
    "table",
    "tableBody"
  );

  const theme: Theme = useTheme();
  const classes = styles(theme);

  const handleTableRowClick = (row: any) => {
    if (isRowDisabled?.(row.id)) {
      return;
    }

    if (onRowClick) {
      onRowClick(row);
      return;
    }

    return;
  };

  return (
    <MuiTableBody
      sx={mergeSx([classes.tableBody.body, customStyles?.body])}
      role="rowgroup"
      aria-label={translateText(["tableBodyLabel"], {
        tableName: tableName
      })}
    >
      {isLoading ? (
        <TableBodyLoadingState
          tableName={tableName}
          headers={headers}
          loadingState={loadingState}
          isActionColumnEnabled={actionColumn?.isEnabled}
          isCheckboxSelectionEnabled={checkboxSelection?.isEnabled}
        />
      ) : rows?.length ? (
        rows.map((row) => (
          <TableRow
            key={row.id}
            role="row"
            tabIndex={0}
            onClick={() => handleTableRowClick(row)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleTableRowClick(row);
              }
            }}
            sx={mergeSx([
              classes.tableBody.row.default,
              classes.tableBody.row?.[
                isRowDisabled?.(row.id) ? "disabled" : "active"
              ],
              customStyles?.row?.[
                isRowDisabled?.(row.id) ? "disabled" : "active"
              ]
            ])}
            aria-label={translateText(["row"], {
              tableName: tableName,
              ariaLabel: row?.ariaLabel?.toLowerCase() ?? ""
            })}
          >
            {checkboxSelection?.isEnabled && (
              <TableCell
                onClick={(e) => e.stopPropagation()}
                sx={mergeSx([
                  classes.checkboxSelection.cell,
                  classes.tableBody.checkboxSelection.cell,
                  checkboxSelection?.customStyles?.cell
                ])}
              >
                <Checkbox
                  color="primary"
                  disabled={isRowDisabled ? isRowDisabled(row.id) : false}
                  checked={selectedRows?.includes(row.id) || false}
                  onChange={checkboxSelection?.handleIndividualSelectClick?.(
                    row.id
                  )}
                  sx={mergeSx([
                    classes.checkboxSelection.checkbox,
                    checkboxSelection?.customStyles?.checkbox
                  ])}
                  slotProps={{
                    input: {
                      "aria-label": translateText(["checkbox"], {
                        tableName: tableName,
                        ariaLabel: row?.ariaLabel?.toLowerCase() ?? ""
                      })
                    }
                  }}
                />
              </TableCell>
            )}
            {headers?.map((header) => (
              <TableCell
                key={header.id}
                sx={mergeSx([
                  classes.tableBody.cell.wrapper,
                  customStyles?.cell?.wrapper
                ])}
                role="cell"
                aria-label={translateText(["tableBodyCell"], {
                  tableName: tableName,
                  headerLabel: header?.label?.toLowerCase() ?? "",
                  rowId: row?.id ?? ""
                })}
              >
                {typeof row[header?.id] === "function" ? (
                  row[header?.id]()
                ) : (
                  <Box
                    sx={mergeSx([
                      classes.tableBody.cell.container,
                      customStyles?.cell?.container
                    ])}
                  >
                    {row[header?.id]}
                  </Box>
                )}
              </TableCell>
            ))}

            <TableBodyActionColumn
              row={row}
              isEnabled={actionColumn?.isEnabled}
              actionBtns={actionColumn?.actionBtns}
              tableName={tableName}
              isRowDisabled={isRowDisabled}
            />
          </TableRow>
        ))
      ) : (
        <TableBodyEmptyState
          headers={headers}
          emptyState={emptyState}
          tableName={tableName}
        />
      )}
    </MuiTableBody>
  );
};

export default TableBody;

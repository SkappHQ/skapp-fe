import {
  Checkbox,
  TableHead as MuiTableHead,
  type SxProps,
  TableCell,
  TableRow,
  Typography,
  useTheme
} from "@mui/material";
import { ChangeEvent, FC } from "react";

import styles from "./styles";

interface Props {
  tableHeaders: any[];
  tableRows: any[];
  isCheckboxSelectionEnabled?: boolean;
  isSelectAllCheckboxEnabled?: boolean;
  selectedRows?: number[];
  handleAllRowsCheck?: (event: ChangeEvent<HTMLInputElement>) => void;
  isRowDisabled?: (row: any) => boolean;
  tableHeaderRowStyles?: SxProps;
  tableHeaderCellStyles?: SxProps;
  tableCheckboxStyles?: SxProps;
  tableHeaderTypographyStyles?: SxProps;
  isActionColumnEnabled?: boolean;
}

const TableHead: FC<Props> = ({
  tableHeaders,
  tableRows,
  isCheckboxSelectionEnabled = false,
  isSelectAllCheckboxEnabled = false,
  selectedRows,
  handleAllRowsCheck,
  isRowDisabled = () => false,
  tableHeaderRowStyles,
  tableHeaderCellStyles,
  tableCheckboxStyles,
  tableHeaderTypographyStyles,
  isActionColumnEnabled = false
}) => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <MuiTableHead sx={classes.tableHeaderStyles}>
      <TableRow sx={classes.tableHeaderRowStyles(tableHeaderRowStyles)}>
        {isCheckboxSelectionEnabled && (
          <TableCell
            sx={
              classes.tableHeaderCheckboxCellStyles(
                tableHeaderCellStyles
              ) as SxProps
            }
          >
            {isSelectAllCheckboxEnabled && (
              <Checkbox
                checked={
                  (tableRows?.length > 0 &&
                    tableRows
                      ?.filter((row) => !isRowDisabled(row))
                      ?.every((row) => selectedRows?.includes(row.id))) ||
                  false
                }
                onChange={handleAllRowsCheck}
                color="primary"
                sx={classes.tableCheckboxStyles(tableCheckboxStyles)}
              />
            )}
          </TableCell>
        )}

        {tableHeaders?.map((header) => (
          <TableCell
            key={header?.id}
            sx={classes.tableHeaderCellStyles(tableHeaderCellStyles)}
          >
            <Typography
              sx={classes.tableHeaderTypographyStyles(
                tableHeaderTypographyStyles
              )}
            >
              {header?.label}
            </Typography>
          </TableCell>
        ))}

        {isActionColumnEnabled && (
          <TableCell
            sx={classes.tableHeaderActionCellStyles(tableHeaderCellStyles)}
          >
            <Typography
              sx={classes.tableHeaderTypographyStyles(
                tableHeaderTypographyStyles
              )}
            >
              Actions
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </MuiTableHead>
  );
};

export default TableHead;

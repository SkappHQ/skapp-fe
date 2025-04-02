import {
  TableHead as MuiTableHead,
  SxProps,
  TableCell,
  TableRow,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import { FC } from "react";

import { TableHeader } from "~community/common/types/CommonTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

export interface TableHeadersProps {
  headers: TableHeader[];
}

export interface TableHeadProps {
  customStyles?: {
    head?: SxProps<Theme>;
    row?: SxProps<Theme>;
    cell?: SxProps<Theme>;
    typography?: SxProps<Theme>;
  };
}

export interface TableHeadActionColumnProps {
  actionColumn?: {
    isEnabled?: boolean;
    styles?: {
      cell?: SxProps<Theme>;
      typography?: SxProps<Theme>;
    };
  };
}

const TableHead: FC<
  TableHeadProps & TableHeadersProps & TableHeadActionColumnProps
> = ({
  headers,
  customStyles,
  actionColumn = {
    isEnabled: false,
    styles: {
      cell: {},
      typography: {}
    }
  }
}) => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <MuiTableHead sx={mergeSx([classes.tableHead.head, customStyles?.head])}>
      <TableRow sx={mergeSx([classes.tableHead.row, customStyles?.row])}>
        {headers?.map((header) => (
          <TableCell
            key={header?.id}
            sx={mergeSx([classes.tableHead.cell, customStyles?.cell])}
          >
            {header?.label && (
              <Typography
                sx={mergeSx([
                  classes.tableHead.typography,
                  customStyles?.typography
                ])}
              >
                {header?.label}
              </Typography>
            )}
            {header?.element && header?.element}
          </TableCell>
        ))}

        {actionColumn.isEnabled && (
          <TableCell
            sx={mergeSx([
              classes.tableHead.actionColumn?.cell,
              customStyles?.cell
            ])}
          >
            <Typography
              sx={mergeSx([
                classes.tableHead.typography,
                customStyles?.typography
              ])}
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

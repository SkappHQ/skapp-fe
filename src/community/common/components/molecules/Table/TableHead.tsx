import {
  Checkbox,
  TableHead as MuiTableHead,
  SxProps,
  TableCell,
  TableRow,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import { FC } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  TableHeaderTypes,
  TableTypes
} from "~community/common/types/CommonTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import { CommonTableProps } from "./Table";
import styles from "./styles";

export interface TableHeadersProps {
  headers: TableHeaderTypes[];
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
  };
}

const TableHead: FC<
  TableTypes & TableHeadProps & CommonTableProps & TableHeadActionColumnProps
> = ({
  tableName,
  rows,
  headers,
  customStyles,
  checkboxSelection,
  actionColumn = {
    isEnabled: false,
    styles: {
      cell: {},
      typography: {}
    }
  }
}) => {
  const translateText = useTranslator(
    "commonAria",
    "components",
    "table",
    "tableHead"
  );
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <MuiTableHead
      sx={mergeSx([classes.tableHead.head, customStyles?.head])}
      role="rowgroup"
      aria-label={translateText(["tableHeadLabel"], {
        tableName: tableName
      })}
    >
      <TableRow
        sx={mergeSx([classes.tableHead.row, customStyles?.row])}
        role="row"
        aria-label={translateText(["tableHeadRowLabel"], {
          tableName: tableName
        })}
      >
        {rows?.length > 0 &&
          checkboxSelection?.isSelectAllVisible &&
          checkboxSelection?.isEnabled && (
            <TableCell
              sx={mergeSx([
                classes.checkboxSelection.cell,
                classes.tableHead.checkboxSelection.cell,
                customStyles?.cell
              ])}
            >
              {checkboxSelection?.isSelectAllEnabled && (
                <Checkbox
                  color="primary"
                  checked={checkboxSelection?.isSelectAllChecked}
                  onChange={() => checkboxSelection?.handleSelectAllClick?.()}
                  sx={mergeSx([
                    classes.checkboxSelection.checkbox,
                    checkboxSelection?.customStyles?.checkbox
                  ])}
                  slotProps={{
                    input: {
                      "aria-label": translateText(["checkbox"], {
                        tableName: tableName
                      })
                    }
                  }}
                />
              )}
            </TableCell>
          )}

        {headers?.map((header) => (
          <TableCell
            key={header?.id}
            sx={mergeSx([classes.tableHead.cell, customStyles?.cell])}
            role="columnheader"
            aria-label={translateText(["tableHeadCell"], {
              tableName: tableName,
              headerLabel: header?.label?.toLowerCase() ?? ""
            })}
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
            role="columnheader"
            aria-label={translateText(["tableHeadActionCell"], {
              tableName: tableName
            })}
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

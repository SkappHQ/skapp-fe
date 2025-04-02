import {
  Table as MuiTable,
  Stack,
  SxProps,
  TableContainer,
  Theme,
  useTheme
} from "@mui/material";
import { FC } from "react";

import { TableHeader } from "~community/common/types/CommonTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import TableBody, { TableBodyProps } from "./TableBody";
import TableFoot, { TableFootProps } from "./TableFoot";
import TableHead, { TableHeadProps } from "./TableHead";
import TableHeadActionToolbar, {
  TableHeadActionRowProps
} from "./TableHeadActionToolbar";
import styles from "./styles";

interface Props {
  actionToolbar?: TableHeadActionRowProps;
  tableHead: TableHeadProps;
  tableBody: TableBodyProps;
  tableFoot?: TableFootProps;
  customStyles?: {
    wrapper?: SxProps<Theme>;
    container?: SxProps<Theme>;
    table: SxProps<Theme>;
  };
}

export interface CommonTableProps {
  isLoading?: boolean;
  headers: TableHeader[];
  rows: any[];
}

const Table: FC<Props & CommonTableProps> = ({
  isLoading,
  headers,
  rows,
  actionToolbar,
  tableHead,
  tableBody,
  tableFoot,
  customStyles
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <Stack sx={mergeSx([classes.wrapper, customStyles?.wrapper])}>
      <TableHeadActionToolbar
        firstRow={actionToolbar?.firstRow}
        secondRow={actionToolbar?.secondRow}
        customStyles={actionToolbar?.customStyles}
      />

      <TableContainer
        sx={mergeSx([classes.container, customStyles?.container])}
      >
        <MuiTable
          stickyHeader
          sx={mergeSx([classes.table, customStyles?.table])}
        >
          <TableHead
            headers={headers}
            customStyles={tableHead.customStyles}
            actionColumn={{
              isEnabled:
                tableBody.actionColumn.actionBtns.left !== null ||
                tableBody.actionColumn.actionBtns.right !== null
            }}
          />
          <TableBody
            isLoading={isLoading}
            headers={headers}
            rows={rows}
            actionColumn={tableBody.actionColumn}
            emptyState={tableBody.emptyState}
            loadingState={tableBody.loadingState}
            customStyles={tableBody.customStyles}
            onRowClick={tableBody.onRowClick}
            isRowDisabled={tableBody.isRowDisabled}
          />
        </MuiTable>
      </TableContainer>

      <TableFoot
        customStyles={tableFoot?.customStyles}
        pagination={tableFoot?.pagination}
        exportBtn={tableFoot?.exportBtn}
      />
    </Stack>
  );
};

export default Table;

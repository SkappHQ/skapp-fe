import {
  Table as MuiTable,
  Stack,
  SxProps,
  TableContainer,
  Theme,
  useTheme
} from "@mui/material";
import { FC, RefObject } from "react";

import {
  TableHeaderTypes,
  TableTypes
} from "~community/common/types/CommonTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import TableBody, { TableBodyProps } from "./TableBody";
import TableFoot, { TableFootProps } from "./TableFoot";
import TableHead, { TableHeadProps } from "./TableHead";
import TableHeadActionToolbar, {
  TableHeadActionRowProps
} from "./TableHeadActionToolbar";
import styles from "./styles";

interface Props {
  tableName: string;
  actionToolbar?: TableHeadActionRowProps;
  tableHead?: TableHeadProps;
  tableBody?: TableBodyProps;
  tableFoot?: TableFootProps;
  customStyles?: {
    wrapper?: SxProps<Theme>;
    container?: SxProps<Theme>;
    table?: SxProps<Theme>;
  };
  tableContainerRef?: RefObject<HTMLDivElement>;
}

interface TableIndexProps {
  wrapper?: number;
  container?: number;
  tableBody?: {
    row?: number;
  };
}

export interface CommonTableProps {
  isLoading?: boolean;
  headers: TableHeaderTypes[];
  rows: any[];
  isRowDisabled?: (row: any) => boolean;
  selectedRows?: number[];
  checkboxSelection?: {
    //NOTE: If you want to disable individual checkbox, you have to use isRowDisabled prop and disable the entire row
    isEnabled?: boolean;
    isSelectAllEnabled?: boolean;
    isSelectAllVisible?: boolean;
    isSelectAllChecked?: boolean;
    handleIndividualSelectClick?: (id: number) => () => void;
    handleSelectAllClick?: () => void;
    customStyles?: { cell?: SxProps<Theme>; checkbox?: SxProps<Theme> };
  };
  tabIndex?: TableIndexProps;
}

const Table: FC<Props & CommonTableProps & TableTypes> = ({
  tableName,
  isLoading,
  headers,
  rows,
  isRowDisabled,
  selectedRows,
  checkboxSelection,
  actionToolbar,
  tableHead,
  tableBody,
  tableFoot,
  customStyles,
  tabIndex,
  tableContainerRef
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <Stack
      sx={mergeSx([classes.wrapper, customStyles?.wrapper])}
      role="group"
      aria-label={`${tableName}-table-wrapper`}
      tabIndex={tabIndex?.wrapper ?? 0}
    >
      <TableHeadActionToolbar
        firstRow={actionToolbar?.firstRow}
        secondRow={actionToolbar?.secondRow}
        customStyles={actionToolbar?.customStyles}
        tableName={tableName}
      />

      <TableContainer
        ref={tableContainerRef}
        sx={mergeSx([classes.container, customStyles?.container])}
        role="region"
        tabIndex={tabIndex?.container ?? 0}
        aria-label={`${tableName}-table-container`}
      >
        <MuiTable
          stickyHeader
          sx={mergeSx([classes.table, customStyles?.table])}
          role="table"
          aria-label={tableName}
        >
          <TableHead
            tableName={tableName}
            headers={headers}
            rows={rows}
            checkboxSelection={checkboxSelection}
            actionColumn={{
              isEnabled:
                tableBody?.actionColumn?.actionBtns?.left !== undefined ||
                tableBody?.actionColumn?.actionBtns?.right !== undefined
            }}
            customStyles={tableHead?.customStyles}
          />
          <TableBody
            tableName={tableName}
            isLoading={isLoading}
            headers={headers}
            rows={rows}
            checkboxSelection={checkboxSelection}
            selectedRows={selectedRows}
            isRowDisabled={isRowDisabled}
            actionColumn={tableBody?.actionColumn}
            emptyState={tableBody?.emptyState}
            loadingState={tableBody?.loadingState}
            customStyles={tableBody?.customStyles}
            onRowClick={tableBody?.onRowClick}
            tabIndex={tabIndex}
          />
        </MuiTable>
      </TableContainer>

      <TableFoot
        customStyles={tableFoot?.customStyles}
        pagination={tableFoot?.pagination}
        exportBtn={tableFoot?.exportBtn}
        customElements={tableFoot?.customElements}
        tableName={tableName}
      />
    </Stack>
  );
};

export default Table;

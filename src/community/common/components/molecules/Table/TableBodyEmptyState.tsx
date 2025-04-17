import { SxProps, TableCell, TableRow, Theme, useTheme } from "@mui/material";
import { FC, JSX } from "react";

import TableEmptyScreen, {
  TableEmptyScreenProps
} from "~community/common/components/molecules/TableEmptyScreen/TableEmptyScreen";
import { TableTypes } from "~community/common/types/CommonTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

export interface TableBodyEmptyStateProps {
  headers: {
    id: string | number;
    label?: string;
    element?: JSX.Element;
  }[];
  emptyState?: {
    noData?: TableEmptyScreenProps;
    customStyles?: { row?: SxProps<Theme>; cell?: SxProps<Theme> };
  };
}

const TableBodyEmptyState: FC<TableTypes & TableBodyEmptyStateProps> = ({
  tableName,
  headers,
  emptyState
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <TableRow
      sx={mergeSx([
        classes.tableBody.emptyState.row,
        emptyState?.customStyles?.row
      ])}
      role="row"
      aria-label={`${tableName}-table-body-empty-state-row`}
    >
      <TableCell
        colSpan={headers?.length + 2}
        sx={mergeSx([
          classes.tableBody.emptyState.cell,
          emptyState?.customStyles?.cell
        ])}
        role="cell"
        aria-label={`${tableName}-table-body-empty-state-cell`}
      >
        <TableEmptyScreen
          title={emptyState?.noData?.title}
          description={emptyState?.noData?.description}
          button={emptyState?.noData?.button}
          customStyles={emptyState?.noData?.customStyles}
        />
      </TableCell>
    </TableRow>
  );
};

export default TableBodyEmptyState;

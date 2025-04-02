import { SxProps, TableCell, TableRow, Theme, useTheme } from "@mui/material";
import { FC, JSX } from "react";

import TableEmptyScreen, {
  TableEmptyScreenProps
} from "~community/common/components/molecules/TableEmptyScreen/TableEmptyScreen";
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
    noRecordsFound?: TableEmptyScreenProps;
    customStyles?: { row?: SxProps<Theme>; cell?: SxProps<Theme> };
  };
  isDataAvailable: boolean;
}

const TableBodyEmptyState: FC<TableBodyEmptyStateProps> = ({
  headers,
  emptyState,
  isDataAvailable
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <TableRow
      sx={mergeSx([
        classes.tableBody.emptyState.row,
        emptyState?.customStyles?.row
      ])}
    >
      <TableCell
        colSpan={headers?.length + 2}
        sx={mergeSx([
          classes.tableBody.emptyState.cell,
          emptyState?.customStyles?.cell
        ])}
      >
        {isDataAvailable ? (
          <TableEmptyScreen
            title={emptyState?.noRecordsFound?.title}
            description={emptyState?.noRecordsFound?.description}
            button={emptyState?.noRecordsFound?.button}
            customStyles={emptyState?.noRecordsFound?.customStyles}
          />
        ) : (
          <TableEmptyScreen
            title={emptyState?.noData?.title}
            description={emptyState?.noData?.description}
            button={emptyState?.noData?.button}
            customStyles={emptyState?.noData?.customStyles}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default TableBodyEmptyState;

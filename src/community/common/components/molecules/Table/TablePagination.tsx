import { Stack, SxProps, useTheme } from "@mui/material";
import { ChangeEvent } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Pagination from "~community/common/components/atoms/Pagination/Pagination";
import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { IconName } from "~community/common/types/IconTypes";

import styles from "./styles";

interface Props {
  totalPages?: number;
  currentPage?: number;
  onPaginationChange?: (event: ChangeEvent<unknown>, value: number) => void;
  exportButtonText?: string;
  onExportButtonClick?: () => void;
  exportTooltipText?: string;
  paginationContainerStyles?: SxProps;
  exportButtonStyles?: SxProps;
  isDataAvailable?: boolean;
}

const TablePagination = ({
  totalPages,
  currentPage,
  onPaginationChange,
  exportButtonText,
  exportButtonStyles,
  onExportButtonClick,
  exportTooltipText,
  paginationContainerStyles,
  isDataAvailable
}: Props) => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <Stack sx={classes.paginationContainerStyles(paginationContainerStyles)}>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage || 0}
        onChange={onPaginationChange ? onPaginationChange : () => {}}
        paginationStyles={classes.paginationStyles}
      />
      <Stack sx={classes.exportButtonWrapperStyles}>
        {isDataAvailable && exportButtonText && (
          <Button
            buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
            size={ButtonSizes.MEDIUM}
            label={exportButtonText}
            isFullWidth={false}
            styles={exportButtonStyles}
            endIcon={IconName.DOWNLOAD_ICON}
            onClick={onExportButtonClick}
          />
        )}
        {exportTooltipText && <Tooltip title={exportTooltipText} />}
      </Stack>
    </Stack>
  );
};

export default TablePagination;

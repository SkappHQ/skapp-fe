import { SxProps, Theme } from "@mui/material";

const styles = (theme: Theme) => ({
  tableWrapperStyles: (tableWrapperStyles?: SxProps) =>
    ({
      width: "100%",
      backgroundColor: theme.palette.grey[100],
      borderRadius: "0.625rem",
      minHeight: "27.5rem",
      ...tableWrapperStyles
    }) as const,
  tableActionRowWrapperStyles: (
    actionRowOneLeftButton: any,
    actionRowOneRightButton: any,
    actionRowTwoLeftButton: any,
    actionRowTwoRightButton: any,
    tableActionRowWrapperStyles?: SxProps
  ) =>
    ({
      width: "100%",
      gap: "1.25rem",
      padding:
        actionRowOneLeftButton ||
        actionRowOneRightButton ||
        actionRowTwoLeftButton ||
        actionRowTwoRightButton
          ? "1.375rem 0.75rem 0.5rem 0.75rem"
          : "0rem",
      ...tableActionRowWrapperStyles
    }) as const,
  tableActionRowStyles: {
    flexDirection: "row",
    gap: "0.75rem",
    width: "100%",
    height: "min-content",
    spacing: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  tableContainerStyles: (tableContainerStyles?: SxProps) =>
    ({
      maxHeight: "27.5rem",
      width: "100%",
      borderRadius: "0.625rem",
      ...tableContainerStyles
    }) as const,
  tableStyles: {
    background: theme.palette.grey[100]
  },
  tableHeaderStyles: {
    height: "min-content",
    width: "100%",
    marginRight: "0rem "
  },
  tableHeaderRowStyles: (tableHeaderRowStyles?: SxProps) =>
    ({
      width: "100%",
      height: "3rem",
      gap: "0.5rem",
      ...tableHeaderRowStyles
    }) as const,
  tableBodyStyles: {
    width: "100%"
  },
  loadingAndEmptyScreen: {
    height: "24.5rem",
    border: "none"
  },
  loadingAndEmptyScreenCell: {
    padding: "0rem 1rem"
  },
  tableRowStyles: (isRowDisabled: boolean, tableRowStyles?: SxProps) =>
    ({
      background: isRowDisabled
        ? theme.palette.grey[100]
        : theme.palette.grey[50],
      transition: "100ms",
      height: "79px",
      gap: "0.5rem",
      ...tableRowStyles
    }) as const,
  tableHeaderCheckboxCellStyles: (tableHeaderCellStyles?: SxProps) =>
    ({
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "4rem",
      padding: "0.5rem 1rem",
      position: "sticky",
      left: 0,
      border: "none",
      width: "6.25rem",
      background: theme.palette.grey[100],
      ...tableHeaderCellStyles
    }) as const,
  tableRowCheckboxSelectionStyles: (tableRowCellStyles?: SxProps) =>
    ({
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "4rem",
      padding: "0.5rem 1rem",
      position: "sticky",
      left: 0,
      background: "inherit",
      "&:hover": {
        backgroundColor: "inherit"
      },
      ...tableRowCellStyles
    }) as const,
  tableCheckboxStyles: (tableCheckboxStyles?: SxProps) =>
    ({
      color: theme.palette.primary.main,
      ...tableCheckboxStyles
    }) as const,
  tableHeaderCellStyles: (tableHeaderCellStyles?: SxProps) =>
    ({
      textAlign: "left",
      minWidth: "8rem",
      width: "fit-content",
      maxWidth: "15rem",
      padding: "0.5rem 1rem",
      border: "none",
      background: theme.palette.grey[100],
      ...tableHeaderCellStyles
    }) as const,
  tableRowCellStyles: (tableRowCellStyles?: SxProps) =>
    ({
      minWidth: "8rem",
      width: "fit-content",
      maxWidth: "15rem",
      padding: "0.5rem 1rem",
      ...tableRowCellStyles
    }) as const,
  tableHeaderTypographyStyles: (tableHeaderTypographyStyles?: SxProps) =>
    ({
      fontWeight: "400",
      fontSize: "0.875rem",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      letterSpacing: "0.03em",
      color: theme.palette.text.secondary,
      textTransform: "uppercase",
      ...tableHeaderTypographyStyles
    }) as const,
  tableHeaderActionCellStyles: (tableHeaderCellStyles?: SxProps) =>
    ({
      textAlign: "left",
      width: "8.4375rem",
      minWidth: "8.4375rem",
      padding: "0.5rem 1rem",
      background: theme.palette.grey[100],
      border: "none",
      ...tableHeaderCellStyles
    }) as const,
  tableRowActionCellStyles: (tableRowCellStyles?: SxProps) =>
    ({
      textAlign: "left",
      padding: "0.5rem 1rem",
      width: "8.4375rem",
      minWidth: "8.4375rem",
      ...tableRowCellStyles
    }) as const,
  iconBtnOneStyles: (styles?: SxProps) =>
    ({
      backgroundColor: theme.palette.grey[100],
      height: "2.25rem",
      p: "0.75rem 1.125rem",
      ...styles
    }) as const,
  iconBtnTwoStyles: (styles?: SxProps) =>
    ({
      backgroundColor: theme.palette.grey[100],
      height: "2.25rem",
      p: "0.75rem 1.2081rem",
      ml: 0.25,
      ...styles
    }) as const,
  paginationContainerStyles: (paginationContainerStyles?: SxProps) =>
    ({
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "auto",
      padding: "1rem",
      ...paginationContainerStyles
    }) as const,
  paginationStyles: {
    margin: "0rem"
  } as const,
  exportButtonWrapperStyles: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    spacing: 1
  }
});

export default styles;

import { SxProps, Theme } from "@mui/material";

interface StylesType {
  wrapper: SxProps<Theme>;
  container: SxProps<Theme>;
  table: SxProps<Theme>;
  actionToolbar: {
    wrapper: SxProps<Theme>;
    row: SxProps<Theme>;
  };
  tableHead: {
    head: SxProps<Theme>;
    row: SxProps<Theme>;
    cell: SxProps<Theme>;
    typography: SxProps<Theme>;
    actionColumn: {
      cell: SxProps<Theme>;
    };
  };
  tableBody: {
    body: SxProps<Theme>;
    row: SxProps<Theme>;
    cell: {
      wrapper: SxProps<Theme>;
      container: SxProps<Theme>;
    };
    typography: SxProps<Theme>;
    emptyState: {
      row: SxProps<Theme>;
      cell: SxProps<Theme>;
    };
    loadingState: {
      row: SxProps<Theme>;
      cell: SxProps<Theme>;
    };
    actionColumn: {
      cell: SxProps<Theme>;
      icons: {
        left: SxProps<Theme>;
        right: SxProps<Theme>;
      };
    };
  };
  tableFoot: {
    wrapper: SxProps<Theme>;
    pagination: SxProps<Theme>;
    exportBtn: {
      wrapper: SxProps<Theme>;
    };
  };
}

const styles = (theme: Theme): StylesType => ({
  wrapper: {
    width: "100%",
    backgroundColor: theme.palette.grey[100],
    borderRadius: "0.625rem",
    minHeight: "27.5rem"
  },
  container: {
    maxHeight: "27.5rem",
    width: "100%",
    borderRadius: "0.625rem"
  },
  table: {
    background: theme.palette.grey[100]
  },
  actionToolbar: {
    wrapper: {
      width: "100%",
      gap: "1.25rem"
    },
    row: {
      flexDirection: "row",
      gap: "0.75rem",
      width: "100%",
      height: "min-content",
      spacing: 1,
      alignItems: "center",
      justifyContent: "space-between"
    }
  },
  tableHead: {
    head: {
      width: "100%",
      height: "min-content",
      marginRight: "0rem"
    },
    row: {
      width: "100%",
      height: "3rem",
      gap: "0.5rem"
    },
    cell: {
      textAlign: "left",
      minWidth: "8rem",
      width: "fit-content",
      maxWidth: "15rem",
      padding: "0.5rem 1rem",
      border: "none",
      background: theme.palette.grey[100]
    },
    typography: {
      fontWeight: "400",
      fontSize: "0.875rem",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      letterSpacing: "0.03em",
      color: theme.palette.text.secondary,
      textTransform: "uppercase"
    },
    actionColumn: {
      cell: {
        textAlign: "left",
        width: "8.4375rem",
        minWidth: "8.4375rem",
        padding: "0.5rem 1rem",
        background: theme.palette.grey[100],
        border: "none"
      }
    }
  },
  tableBody: {
    body: { width: "100%" },
    row: {
      transition: "100ms",
      height: "79px",
      gap: "0.5rem",
      "&:hover": {
        cursor: "pointer",
        background: theme.palette.grey.A200
      }
    },
    cell: {
      wrapper: {
        width: "fit-content",
        minWidth: "8rem",
        maxWidth: "15rem",
        padding: "0.5rem 1rem"
      },
      container: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start"
      }
    },
    typography: {},
    actionColumn: {
      cell: {
        textAlign: "left",
        padding: "0.5rem 1rem",
        width: "8.4375rem",
        minWidth: "8.4375rem"
      },
      icons: {
        left: {
          backgroundColor: theme.palette.grey[100],
          height: "2.25rem",
          p: "0.75rem 1.125rem"
        },
        right: {
          backgroundColor: theme.palette.grey[100],
          height: "2.25rem",
          p: "0.75rem 1.2081rem",
          ml: 0.25
        }
      }
    },
    emptyState: {
      row: {
        height: "24.5rem",
        border: "none"
      },
      cell: {
        border: "none",
        padding: "0rem"
      }
    },
    loadingState: {
      row: {
        height: "24.5rem",
        border: "none"
      },
      cell: {
        padding: "0rem 1rem"
      }
    }
  },
  tableFoot: {
    wrapper: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "auto",
      padding: "1rem"
    },
    pagination: {
      margin: "0rem"
    },
    exportBtn: {
      wrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        spacing: 1
      }
    }
  }
});

export default styles;

import { Box } from "@mui/material";
import { JSX } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import Table from "~community/common/components/molecules/Table/Table";
import { Modules } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import attendanceModuleRolesTableData from "~community/configurations/data/attendanceModuleRolesTableData.json";
import leaveModuleRolesTableData from "~community/configurations/data/leaveModuleRolesTableData.json";
import peopleModuleRolesTableData from "~community/configurations/data/peopleModuleRolesTableData.json";

import styles from "./styles";

interface Props {
  module: Modules;
}

const ModuleRolesTable = ({ module }: Props): JSX.Element => {
  const classes = styles();

  const translateText = useTranslator("configurations", "userRoles");

  const getTableData = () => {
    switch (module) {
      case Modules.ATTENDANCE:
        return attendanceModuleRolesTableData;
      case Modules.LEAVE:
        return leaveModuleRolesTableData;
      case Modules.PEOPLE:
        return peopleModuleRolesTableData;
      default:
        return [];
    }
  };

  const getIcon = (status: boolean) => {
    return status ? (
      <Icon name={IconName.CURVED_TICK_ICON} />
    ) : (
      <Icon name={IconName.DASH_ICON} />
    );
  };

  const transformToTableRows = () => {
    return (
      getTableData()?.map((data, index) => ({
        id: index,
        permission: translateText([data.permission]),
        admin: (
          <>
            {getIcon(data.admin.enabled)}
            {data.admin.viewOnly ? translateText(["viewOnly"]) : ""}
          </>
        ),
        manager: (
          <>
            {getIcon(data.manager.enabled)}
            {data.manager.viewOnly ? translateText(["viewOnly"]) : ""}
          </>
        ),
        employee: (
          <>
            {getIcon(data.employee.enabled)}
            {data.employee.viewOnly ? translateText(["viewOnly"]) : ""}
          </>
        )
      })) || []
    );
  };

  const columns = [
    { field: "permission", headerName: "" },
    { field: "admin", headerName: translateText(["adminHeader"]) },
    { field: "manager", headerName: translateText(["managerHeader"]) },
    { field: "employee", headerName: translateText(["employeeHeader"]) }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  return (
    <Box sx={classes.container}>
      <Table
        isLoading={false}
        isPaginationEnabled={false}
        tableHeaders={tableHeaders}
        tableRows={transformToTableRows()}
      />
    </Box>
  );
};

export default ModuleRolesTable;

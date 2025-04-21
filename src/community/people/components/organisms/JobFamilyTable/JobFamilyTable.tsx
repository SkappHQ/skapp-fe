import { Box, Theme, useTheme } from "@mui/material";
import { FC } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import AvatarGroup from "~community/common/components/molecules/AvatarGroup/AvatarGroup";
import Table from "~community/common/components/molecules/Table/Table";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { TableNames } from "~community/common/enums/Table";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { JobFamilyActionModalEnums } from "~community/people/enums/JobFamilyEnums";
import { usePeopleStore } from "~community/people/store/store";
import {
  AllJobFamilyType,
  JobFamilyEmployeeDataType
} from "~community/people/types/JobFamilyTypes";
import {
  handleJobFamilyDeleteBtnClick,
  handleJobFamilyEditBtnClick
} from "~community/people/utils/jobFamilyUtils/jobFamilyTableUtils";
import useProductTour from "~enterprise/common/hooks/useProductTour";
import { useCommonEnterpriseStore } from "~enterprise/common/store/commonStore";

import styles from "./styles";

interface Props {
  jobFamilySearchTerm: string;
  allJobFamilies: AllJobFamilyType[] | undefined;
  isJobFamilyPending: boolean;
}

const JobFamilyTable: FC<Props> = ({
  jobFamilySearchTerm,
  allJobFamilies,
  isJobFamilyPending
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateText = useTranslator("peopleModule", "jobFamily");

  const { isPeopleAdmin } = useSessionData();

  const { destroyDriverObj } = useProductTour();

  const {
    setCurrentEditingJobFamily,
    setCurrentDeletingJobFamily,
    setJobFamilyModalType
  } = usePeopleStore((state) => ({
    setCurrentEditingJobFamily: state.setCurrentEditingJobFamily,
    setCurrentDeletingJobFamily: state.setCurrentDeletingJobFamily,
    setJobFamilyModalType: state.setJobFamilyModalType
  }));

  const { ongoingQuickSetup, quickSetupCurrentFlowSteps } =
    useCommonEnterpriseStore((state) => ({
      ongoingQuickSetup: state.ongoingQuickSetup,
      quickSetupCurrentFlowSteps: state.quickSetupCurrentFlowSteps
    }));

  const transformToTableRows = () => {
    return (
      allJobFamilies
        ?.filter((jobFamilyData: AllJobFamilyType) =>
          jobFamilyData?.name
            ?.toLowerCase()
            ?.includes(jobFamilySearchTerm?.toLowerCase())
        )
        .map((jobFamilyData: AllJobFamilyType) => ({
          id: jobFamilyData.jobFamilyId,
          ariaLabel: jobFamilyData.name,
          jobFamily: jobFamilyData.name,
          employees:
            ((jobFamilyData?.employees as JobFamilyEmployeeDataType[])?.length <
            2 ? (
              (jobFamilyData?.employees as JobFamilyEmployeeDataType[]).map(
                (employee: JobFamilyEmployeeDataType) => {
                  return (
                    <AvatarChip
                      key={employee.employeeId}
                      firstName={employee?.firstName ?? ""}
                      lastName={employee?.lastName}
                      avatarUrl={employee?.authPic}
                      isResponsiveLayout
                      chipStyles={classes.avatarChip}
                    />
                  );
                }
              )
            ) : (
              <AvatarGroup
                componentStyles={classes.avatarGroup}
                avatars={
                  jobFamilyData?.employees
                    ? (
                        jobFamilyData?.employees as JobFamilyEmployeeDataType[]
                      ).map((employee: JobFamilyEmployeeDataType) => ({
                        firstName: employee.firstName,
                        lastName: employee.lastName,
                        image: employee.authPic as string
                      }))
                    : []
                }
                max={6}
              />
            )) || [],
          actionData: jobFamilyData,
          actions: (
            <Button
              label={translateText(["viewBtnText"])}
              buttonStyle={ButtonStyle.TERTIARY}
              styles={{ width: "61px", height: "42px", padding: "12px 16px" }}
              onClick={() =>
                handleJobFamilyEditBtnClick(
                  jobFamilyData,
                  setCurrentEditingJobFamily,
                  setJobFamilyModalType
                )
              }
            />
          )
        })) || []
    );
  };

  const columns = [
    { field: "jobFamily", headerName: translateText(["jobFamilyHeader"]) },
    { field: "employees", headerName: translateText(["memberHeader"]) },
    ...(!isPeopleAdmin
      ? [{ field: "actions", headerName: translateText(["actionsHeader"]) }]
      : [])
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  return (
    <Box sx={classes.wrapper}>
      <Table
        tableName={TableNames.JOB_FAMILY}
        headers={tableHeaders}
        rows={transformToTableRows()}
        tableHead={{
          customStyles: {
            row: classes.tableHeadStyles,
            cell: classes.tableHeaderCellStyles
          }
        }}
        tableBody={{
          emptyState: {
            noData: {
              title:
                allJobFamilies && allJobFamilies?.length > 0
                  ? translateText(["emptyScreen", "title"])
                  : translateText(["emptySearchResult", "title"]),
              description:
                allJobFamilies && allJobFamilies?.length > 0
                  ? translateText(["emptyScreen", "description"])
                  : translateText(["emptySearchResult", "description"]),
              button: {
                id: "add-job-family-empty-table-screen-button",
                label: translateText(["addJobFamily"]),
                shouldBlink:
                  ongoingQuickSetup.DEFINE_JOB_FAMILIES &&
                  quickSetupCurrentFlowSteps !== null,
                onClick: () => {
                  setJobFamilyModalType(
                    JobFamilyActionModalEnums.ADD_JOB_FAMILY
                  );
                  destroyDriverObj();
                }
              }
            }
          },
          loadingState: {
            skeleton: {
              rows: 6
            }
          },
          actionColumn: {
            isEnabled: isPeopleAdmin,
            actionBtns: {
              left: {
                onClick: (jobFamilyData: AllJobFamilyType) => {
                  handleJobFamilyEditBtnClick(
                    jobFamilyData,
                    setCurrentEditingJobFamily,
                    setJobFamilyModalType
                  );
                }
              },
              right: {
                onClick: (jobFamilyData: AllJobFamilyType) =>
                  handleJobFamilyDeleteBtnClick(
                    allJobFamilies,
                    jobFamilyData,
                    setCurrentDeletingJobFamily,
                    setJobFamilyModalType
                  )
              }
            }
          }
        }}
        tableFoot={{
          pagination: {
            isEnabled: false
          }
        }}
        customStyles={{
          container: classes.tableContainerStyles
        }}
        isLoading={isJobFamilyPending}
      />
    </Box>
  );
};

export default JobFamilyTable;

import { useTheme } from "@mui/material";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

import ManagerTimesheet from "~community/attendance/components/organisms/ManagerTimesheet/ManagerTImesheet";
import Search from "~community/common/components/molecules/Search/Search";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import ROUTES from "~community/common/constants/routes";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes, ManagerTypes } from "~community/common/types/AuthTypes";
import {
  EmployeeSearchResultType,
  TeamSearchResultType
} from "~community/common/types/CommonTypes";
import { useGetEmployeesAndTeamsForAnalytics } from "~community/people/api/PeopleApi";
import { usePeopleStore } from "~community/people/store/store";

const AllTimesheetsPage: NextPage = () => {
  const translateText = useTranslator("attendanceModule", "timesheet");
  const theme = useTheme();
  const router = useRouter();
  const { data } = useSession();
  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchErrors] = useState<string | undefined>(undefined);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");

  const { setIsFromPeopleDirectory, setViewEmployeeId, setSelectedEmployeeId } =
    usePeopleStore((state) => state);
  const { data: suggestions } = useGetEmployeesAndTeamsForAnalytics(
    searchTerm || " "
  );

  const onSearchChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    e.target.value = e.target.value.replace(/^\s+/g, "");
    setSearchTerm(e.target.value);
  };

  const onSelectResult = async (
    result: EmployeeSearchResultType | TeamSearchResultType
  ): Promise<void> => {
    if ((result as EmployeeSearchResultType)?.employeeId) {
      const employeeId = (result as EmployeeSearchResultType)?.employeeId;
      const employeeName = `${(result as EmployeeSearchResultType)?.firstName} ${
        (result as EmployeeSearchResultType)?.lastName
      }`;

      setSelectedUserName(employeeName);
      setSelectedTeamName("");

      await handleRowClick({
        id: employeeId
      });
    } else {
      const teamId = (result as TeamSearchResultType)?.teamId;
      await router.push(
        `${ROUTES.TIMESHEET.TIMESHEET_ANALYTICS}/${teamId}?teamName=${encodeURIComponent((result as TeamSearchResultType)?.teamName)}`
      );
      setSelectedTeamName((result as TeamSearchResultType)?.teamName);
      setSelectedUserName("");
    }
    setIsPopperOpen(false);
    setSearchTerm("");
  };

  const handleRowClick = async (employee: { id: number }) => {
    if (
      data?.user.roles?.includes(
        ManagerTypes.PEOPLE_MANAGER || AdminTypes.SUPER_ADMIN
      )
    ) {
      setSelectedEmployeeId(employee.id);
      const url = `${ROUTES.PEOPLE.EDIT_ALL_INFORMATION(employee.id)}?tab=timesheet`;
      await router.push(url);
    } else {
      setIsFromPeopleDirectory(true);
      setViewEmployeeId(employee.id);
      const url = `${ROUTES.PEOPLE.INDIVIDUAL}?tab=timesheet&viewEmployeeId=${employee.id}`;
      await router.push(url);
    }
  };

  return (
    <ContentLayout
      title={translateText(["allTimesheets.title"])}
      isDividerVisible={true}
      pageHead={translateText(["allTimesheets.pageHead"])}
    >
      <>
        <Search
          placeHolder={
            selectedUserName || selectedTeamName || translateText(["search"])
          }
          label=""
          setIsPopperOpen={setIsPopperOpen}
          isPopperOpen={isPopperOpen}
          labelStyles={{ mb: "0.25rem" }}
          onChange={onSearchChange}
          value={searchTerm}
          error={searchErrors}
          onSelectMember={(result) =>
            onSelectResult(
              result as EmployeeSearchResultType | TeamSearchResultType
            )
          }
          isAutoFocus={true}
          filterSearchResult={true}
          isEmployeeAndUserSearch={true}
          employeeAndUserSearchResult={suggestions}
          suggestionBoxStyles={{
            maxHeight: "15.625rem",
            backgroundColor: theme.palette.notifyBadge.contrastText
          }}
          popperStyles={{
            boxShadow: `0rem 0.25rem 1.25rem ${theme.palette.grey.A200}`,
            width: "100%"
          }}
        />
        <ManagerTimesheet />
      </>
    </ContentLayout>
  );
};

export default AllTimesheetsPage;

import { Box, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import SearchBox from "~community/common/components/molecules/SearchBox/SearchBox";
import ROUTES from "~community/common/constants/routes";
import { peopleDirectoryTestId } from "~community/common/constants/testIds";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes, ManagerTypes } from "~community/common/types/AuthTypes";
import { IconName } from "~community/common/types/IconTypes";
import {
  useGetBannerData,
  useGetEmployeeData
} from "~community/people/api/PeopleApi";
import EmployeeDataBanner from "~community/people/components/molecules/EmployeeDataBanner/EmployeeDataBanner";
import PeopleTable from "~community/people/components/molecules/PeopleTable/PeopleTable";
import { usePeopleStore } from "~community/people/store/store";
import {
  DataFilterEnums,
  EmployeeDataType,
  EmploymentStatusTypes
} from "~community/people/types/EmployeeTypes";

const EmployeeData = () => {
  const translateText = useTranslator("peopleModule", "peoples");
  const router = useRouter();
  const { data } = useSession();

  const isPeopleManagerOrSuperAdmin = data?.user.roles?.includes(
    ManagerTypes.PEOPLE_MANAGER || AdminTypes.SUPER_ADMIN
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeDataItems, setEmployeeDataItems] = useState<
    EmployeeDataType[]
  >([]);
  const [isConcatenationDone, setIsConcatenationDone] =
    useState<boolean>(false);

  const {
    data: employeeData,
    fetchNextPage,
    isLoading: isEmployeeDataLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage
  } = useGetEmployeeData();

  const {
    isPendingInvitationListOpen,
    setSearchKeyword,
    setEmployeeDataParams,
    resetEmployeeDataParams
  } = usePeopleStore((state) => state);

  const { data: bannerData } = useGetBannerData();

  const handleBannerClick = (): void => {
    resetEmployeeDataParams();
    router.push(ROUTES.PEOPLE.PENDING);
  };

  useEffect(() => {
    if (employeeData?.pages) {
      const employeeDataItems = employeeData?.pages
        ?.map((page: any) => page?.items)
        ?.flat();
      setEmployeeDataItems(employeeDataItems);
      setIsConcatenationDone(true);
    } else if (isFetching && !isEmployeeDataLoading) {
      setIsConcatenationDone(true);
    } else {
      setIsConcatenationDone(false);
    }
  }, [
    employeeData,
    isEmployeeDataLoading,
    isFetching,
    isFetchingNextPage,
    isPendingInvitationListOpen
  ]);

  useEffect(() => {
    setSearchKeyword(searchTerm.trimStart());
  }, [searchTerm, setSearchKeyword]);

  useEffect(() => {
    setSearchTerm("");
    if (isPendingInvitationListOpen) {
      setEmployeeDataParams(DataFilterEnums.ACCOUNT_STATUS, [
        EmploymentStatusTypes.PENDING
      ]);
    }
  }, [isPendingInvitationListOpen, setEmployeeDataParams]);

  return (
    <Stack>
      <SearchBox
        value={searchTerm}
        setSearchTerm={setSearchTerm}
        placeHolder={translateText(["employeeSearchPlaceholder"])}
        data-testid={peopleDirectoryTestId.searchInput}
      />
      {bannerData &&
      bannerData > 0 &&
      !isPendingInvitationListOpen &&
      isPeopleManagerOrSuperAdmin ? (
        <EmployeeDataBanner
          startingIcon={IconName.CLOCK_ICON}
          count={bannerData}
          title={translateText(["bannerTitle"])}
          titleForOne={translateText(["bannerTitleForOne"])}
          prompt={translateText(["bannerPrompt"])}
          onClick={handleBannerClick}
        />
      ) : (
        <Box sx={{ height: "1.5rem" }} />
      )}

      <PeopleTable
        employeeData={employeeDataItems}
        fetchNextPage={fetchNextPage}
        isFetching={!isConcatenationDone}
        isFetchingNextPage={isFetchingNextPage}
        onSearch={searchTerm?.length > 0}
        hasNextPage={hasNextPage}
      />
    </Stack>
  );
};

export default EmployeeData;

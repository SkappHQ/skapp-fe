import { Box, Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect, useRef } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import Avatar from "~community/common/components/molecules/Avatar/Avatar";
import NoDataScreen from "~community/common/components/molecules/NoDataScreen/NoDataScreen";
import ROUTES from "~community/common/constants/routes";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes, ManagerTypes } from "~community/common/types/AuthTypes";
import { IconName } from "~community/common/types/IconTypes";
import { testPassiveEventSupport } from "~community/common/utils/commonUtil";
import { usePeopleStore } from "~community/people/store/store";
import {
  EmployeeDataType,
  EmploymentStatusTypes
} from "~community/people/types/EmployeeTypes";

import styles from "./styles";

interface Props {
  employeeData: EmployeeDataType[];
  fetchNextPage: () => void;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  onSearch: boolean;
  hasNextPage?: boolean;
}

const EmployeeList: FC<Props> = ({
  employeeData,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);
  const { data } = useSession();
  const router = useRouter();
  const translateText = useTranslator("peopleModule", "peoples");

  const listInnerRef = useRef<HTMLDivElement>();
  const supportsPassive = testPassiveEventSupport();

  const { setIsFromPeopleDirectory, setViewEmployeeId, setSelectedEmployeeId } =
    usePeopleStore((state) => state);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;
      if (isNearBottom && !isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;

    if (!isFetchingNextPage && listInnerElement) {
      listInnerElement.addEventListener(
        "touchmove",
        onScroll,
        supportsPassive ? { passive: true } : false
      );

      listInnerElement?.addEventListener(
        "wheel",
        onScroll,
        supportsPassive ? { passive: true } : false
      );

      return () => {
        listInnerElement?.removeEventListener("touchmove", onScroll);
        listInnerElement?.removeEventListener("wheel", onScroll);
      };
    }
  }, [isFetchingNextPage, hasNextPage]);

  const handleRowClick = async (id: number) => {
    if (
      data?.user.roles?.includes(
        ManagerTypes.PEOPLE_MANAGER || AdminTypes.SUPER_ADMIN
      )
    ) {
      setSelectedEmployeeId(id);
      await router.push(ROUTES.PEOPLE.EDIT_ALL_INFORMATION(id));
    } else {
      setIsFromPeopleDirectory(true);
      setViewEmployeeId(id);
      await router.push(ROUTES.PEOPLE.INDIVIDUAL);
    }
  };

  return (
    <Box sx={classes.widgetBody}>
      <Box ref={listInnerRef}>
        {employeeData.length === 0 && <NoDataScreen />}
        {employeeData?.map((employee) => {
          return (
            <Box
              sx={classes.listItemRow}
              key={employee.identificationNo}
              onClick={() => handleRowClick(employee.employeeId)}
            >
              <Box sx={classes.listItem}>
                <Box sx={{ margin: "auto" }}>
                  <Avatar
                    firstName={employee.firstName}
                    lastName={employee.lastName}
                    src={employee.avatarUrl ?? ""}
                  />
                </Box>
                <Box sx={{ display: "block" }}>
                  <Typography sx={classes.name}>
                    {employee.employeeName}
                  </Typography>
                  <Typography sx={classes.email}>{employee.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ justifyContent: "end" }}>
                {employee.accountStatus === EmploymentStatusTypes.PENDING && (
                  <Stack sx={classes.pendingChip}>
                    <Icon
                      name={IconName.CLOCK_ICON}
                      fill={theme.palette.amber.dark}
                    />
                    {translateText(["Pending"])}
                  </Stack>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default EmployeeList;

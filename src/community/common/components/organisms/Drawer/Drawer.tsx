import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  Stack,
  Theme,
  useTheme
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { JSX, useEffect, useMemo, useState } from "react";

import { useGetUploadedImage } from "~community/common/api/FileHandleApi";
import { useGetOrganization } from "~community/common/api/OrganizationCreateApi";
import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { appModes } from "~community/common/constants/configs";
import { appDrawerTestId } from "~community/common/constants/testIds";
import { FileTypes } from "~community/common/enums/CommonEnums";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import useDrawer from "~community/common/hooks/useDrawer";
import {
  MediaQueries,
  useMediaQuery
} from "~community/common/hooks/useMediaQuery";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useCommonStore } from "~community/common/stores/commonStore";
import { themeSelector } from "~community/common/theme/themeSelector";
import { EmployeeTypes } from "~community/common/types/AuthTypes";
import { ThemeTypes } from "~community/common/types/AvailableThemeColors";
import { IconName } from "~community/common/types/IconTypes";
import { CommonStoreTypes } from "~community/common/types/zustand/StoreTypes";
import getDrawerRoutes from "~community/common/utils/getDrawerRoutes";
import { MyRequestModalEnums } from "~community/leave/enums/MyRequestEnums";
import { useLeaveStore } from "~community/leave/store/store";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import useS3Download from "~enterprise/common/hooks/useS3Download";
import { useCommonEnterpriseStore } from "~enterprise/common/store/commonStore";

import { StyledDrawer } from "./StyledDrawer";
import { getSelectedDrawerItemColor, styles } from "./styles";

const Drawer = (): JSX.Element => {
  const translateText = useTranslator("commonComponents", "drawer");

  const [orgLogo, setOrgLogo] = useState<string | null>(null);
  const router = useRouter();
  const environment = useGetEnvironment();
  const { s3FileUrls, downloadS3File } = useS3Download();

  const theme: Theme = useTheme();
  const classes = styles({ theme });

  const queryMatches = useMediaQuery();
  const isBelow1024 = queryMatches(MediaQueries.BELOW_1024);

  const { data: sessionData } = useSession();

  const { handleDrawer } = useDrawer(isBelow1024);

  const { globalLoginMethod } = useCommonEnterpriseStore((state) => state);

  const isEnterprise = environment === appModes.ENTERPRISE;

  const drawerRoutes = useMemo(
    () =>
      getDrawerRoutes(
        sessionData?.user?.roles,
        isEnterprise,
        globalLoginMethod
      ),
    [sessionData, globalLoginMethod, isEnterprise]
  );

  const { data: organizationDetails, isLoading: orgLoading } =
    useGetOrganization();

  const updatedTheme = themeSelector(
    organizationDetails?.results?.[0]?.themeColor || ThemeTypes.BLUE_THEME
  );

  theme.palette = updatedTheme.palette;

  const organizationLogo = organizationDetails?.results[0]?.organizationLogo;
  const organizationName = organizationDetails?.results[0]?.organizationName;

  const { data: logoUrl, isLoading } = useGetUploadedImage(
    FileTypes.ORGANIZATION_LOGOS,
    organizationLogo,
    false
  );

  useEffect(() => {
    if (environment === appModes.COMMUNITY) {
      if (logoUrl) setOrgLogo(logoUrl);
    } else if (environment === appModes.ENTERPRISE) {
      setOrgLogo(s3FileUrls[organizationLogo]);
    }
  }, [logoUrl, organizationLogo, s3FileUrls, environment]);

  useEffect(() => {
    if (organizationLogo || !s3FileUrls[organizationLogo]) {
      downloadS3File(organizationLogo);
    }
  }, [organizationLogo]);

  const {
    isDrawerExpanded,
    expandedDrawerListItem,
    setExpandedDrawerListItem,
    setOrgData
  } = useCommonStore((state: CommonStoreTypes | any) => ({
    isDrawerExpanded: state.isDrawerExpanded,
    expandedDrawerListItem: state.expandedDrawerListItem,
    setExpandedDrawerListItem: state.setExpandedDrawerListItem,
    setOrgData: state.setOrgData
  }));

  const { setMyLeaveRequestModalType } = useLeaveStore();

  const [hoveredDrawerItemUrl, setHoveredDrawerItemUrl] = useState<string>("");

  const handleListItemButtonClick = (
    id: string,
    hasSubTree: boolean,
    url: string | null
  ) => {
    if (!hasSubTree) {
      router.push(url ?? "");
      isBelow1024 && handleDrawer();
    } else {
      setExpandedDrawerListItem(expandedDrawerListItem === id ? "" : id);
    }
  };

  useEffect(() => {
    if (organizationDetails?.results[0] && !orgLoading) {
      setOrgData(organizationDetails?.results[0]);
    }
  }, [organizationDetails, orgLoading]);

  return (
    <StyledDrawer
      variant="permanent"
      anchor="left"
      open={isDrawerExpanded}
      onClose={handleDrawer}
      hideBackdrop={false}
    >
      <IconButton
        sx={{ ...classes.iconBtn(isDrawerExpanded), visibility: "visible" }} // TO DO: Need to verify why this style affects other places which use this icon
        onClick={handleDrawer}
        data-testid={appDrawerTestId.buttons.drawerToggleBtn}
      >
        <Icon
          name={IconName.CHEVRON_RIGHT_ICON}
          fill={theme.palette.common.black}
        />
      </IconButton>
      <Stack
        sx={{
          ...classes.drawerContainer(isDrawerExpanded),
          visibility: "visible"
        }}
      >
        <Box sx={classes.imageWrapper}>
          {!isLoading && (
            <img
              src={orgLogo || "/logo/logo.png"}
              alt={organizationName ?? "Organization Logo"}
              width={logoUrl ? 0 : 208}
              height={logoUrl ? 0 : 77}
              style={classes.logoImage}
              data-testid={appDrawerTestId.organizationLogo}
            />
          )}
        </Box>
        <List sx={classes.list}>
          {drawerRoutes &&
            drawerRoutes?.map((route) => (
              <ListItem
                disablePadding
                key={route?.id}
                sx={classes.listItem}
                data-testid={appDrawerTestId.mainRoutes + route?.id}
              >
                <ListItemButton
                  disableRipple
                  sx={classes.listItemButton}
                  onClick={() =>
                    handleListItemButtonClick(
                      route?.id ?? "",
                      route?.hasSubTree ?? false,
                      route?.url ?? null
                    )
                  }
                  onMouseEnter={() => setHoveredDrawerItemUrl(route?.url ?? "")}
                  onMouseLeave={() => setHoveredDrawerItemUrl("")}
                >
                  <ListItemIcon sx={classes.listItemIcon}>
                    {route?.icon && (
                      <Icon
                        name={route?.icon}
                        fill={getSelectedDrawerItemColor(
                          theme,
                          router.pathname,
                          hoveredDrawerItemUrl,
                          route?.url
                        )}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={route?.name}
                    sx={classes.listItemText(
                      getSelectedDrawerItemColor(
                        theme,
                        router.pathname,
                        hoveredDrawerItemUrl,
                        route?.url ?? null
                      )
                    )}
                  />
                  <ListItemIcon
                    sx={classes.chevronIcons(
                      expandedDrawerListItem,
                      route?.id ?? "",
                      route?.hasSubTree ?? false
                    )}
                  >
                    <Icon
                      name={IconName.EXPAND_ICON}
                      width="0.625rem"
                      height="0.3125rem"
                      fill={getSelectedDrawerItemColor(
                        theme,
                        router.pathname,
                        hoveredDrawerItemUrl,
                        route?.url ?? ""
                      )}
                    />
                  </ListItemIcon>
                </ListItemButton>
                <Collapse
                  in={route?.id === expandedDrawerListItem}
                  collapsedSize="0rem"
                  sx={classes.subList}
                >
                  <List sx={classes.subListItem}>
                    {route?.hasSubTree &&
                      route?.subTree?.map((subTreeRoute) => (
                        <ListItemButton
                          disableRipple
                          key={subTreeRoute.id}
                          sx={classes.subListItemButton}
                          onClick={() =>
                            handleListItemButtonClick(
                              subTreeRoute.id,
                              subTreeRoute.hasSubTree,
                              subTreeRoute.url
                            )
                          }
                          onMouseEnter={() =>
                            setHoveredDrawerItemUrl(subTreeRoute.url)
                          }
                          onMouseLeave={() => setHoveredDrawerItemUrl("")}
                          data-testid={
                            appDrawerTestId.subRoutes + subTreeRoute.id
                          }
                        >
                          <ListItemText
                            primary={subTreeRoute.name}
                            sx={classes.subListItemText(
                              getSelectedDrawerItemColor(
                                theme,
                                router.pathname,
                                hoveredDrawerItemUrl,
                                subTreeRoute.url
                              )
                            )}
                          />
                        </ListItemButton>
                      ))}
                  </List>
                </Collapse>
              </ListItem>
            ))}
        </List>
        {isDrawerExpanded && (
          <Stack sx={classes.footer}>
            {sessionData?.user.roles?.includes(
              EmployeeTypes.LEAVE_EMPLOYEE
            ) && (
              <Button
                styles={classes.applyLeaveBtn}
                isFullWidth={false}
                label={translateText(["applyLeaveBtn"])}
                buttonStyle={ButtonStyle.PRIMARY}
                endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
                onClick={() =>
                  setMyLeaveRequestModalType(
                    MyRequestModalEnums.LEAVE_TYPE_SELECTION
                  )
                }
                data-testid={appDrawerTestId.buttons.applyLeaveBtn}
              />
            )}
            <MuiLink
              href="https://docs.skapp.com"
              target="_blank"
              variant="body1"
              color="inherit"
              underline="hover"
              sx={classes.link}
              data-testid={appDrawerTestId.getHelpLink}
            >
              {translateText(["getHelp"])}
            </MuiLink>
          </Stack>
        )}
      </Stack>
    </StyledDrawer>
  );
};

export default Drawer;

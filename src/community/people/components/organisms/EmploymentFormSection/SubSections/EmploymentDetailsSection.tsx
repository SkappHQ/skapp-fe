import { Grid2 as Grid } from "@mui/material";
import { Theme, useTheme } from "@mui/system";
import { DateTime } from "luxon";
import { useState } from "react";

import AvatarSearch from "~community/common/components/molecules/AvatarSearch/AvatarSearch";
import DropdownAutocomplete from "~community/common/components/molecules/DropdownAutocomplete/DropdownAutocomplete";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import InteractiveInputTrigger from "~community/common/components/molecules/InteractiveInputTrigger/InteractiveInputTrigger";
import MultiSelectChipInput from "~community/common/components/molecules/MultiSelectChipInput";
import MultivalueDropdownList from "~community/common/components/molecules/MultiValueDropdownList/MultivalueDropdownList";
import { REVERSE_DATE_FORMAT } from "~community/common/constants/timeConstants";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { DropdownListType } from "~community/common/types/CommonTypes";
import { timeZonesList } from "~community/common/utils/data/timeZones";
import { usePeopleStore } from "~community/people/store/store";
import { TeamNamesType } from "~community/people/types/TeamTypes";
import { EmployementAllocationList } from "~community/people/utils/data/employeeSetupStaticData";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";
import TeamModalController from "../../TeamModalController/TeamModalController";

interface Props {
  isManager?: boolean;
  isUpdate?: boolean;
  isProfileView?: boolean;
  isInputsDisabled?: boolean;
  isEmployee?: boolean;
}

const EmploymentDetailsSection = ({
  isManager = false,
  isUpdate = false,
  isProfileView = false,
  isInputsDisabled = false,
  isEmployee = false
}: Props) => {
  const theme: Theme = useTheme();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "employmentDetails"
  );

  const { isPeopleManager } = useSessionData();

  const [isPrimaryManagerPopperOpen, setIsPrimaryManagerPopperOpen] =
    useState<boolean>(false);
  const [isSecondaryManagerPopperOpen, setIsSecondaryManagerPopperOpen] =
    useState<boolean>(false);

  const [selectedJoinedDate, setSelectedJoinedDate] = useState<
    DateTime | undefined
  >(undefined);
  const [selectedProbationStartDate, setSelectedProbationStartDate] = useState<
    DateTime | undefined
  >(undefined);
  const [selectedProbationEndDate, setSelectedProbationEndDate] = useState<
    DateTime | undefined
  >(undefined);

  const [latestTeamId, setLatestTeamId] = useState<number | null>();

  const { projectTeamNames, isPendingInvitationListOpen } = usePeopleStore(
    (state) => state
  );

  const workTimeZoneDictionary: Record<string, string> = timeZonesList.reduce<
    Record<string, string>
  >((acc: Record<string, string>, curr: { value: string; label: string }) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  const projectTeamList: DropdownListType[] = projectTeamNames?.map(
    (projectTeamName: TeamNamesType) => {
      return {
        label: projectTeamName.teamName,
        value: projectTeamName.teamId
      };
    }
  );

  return (
    <PeopleFormSectionWrapper
      title={translateText(["title"])}
      containerStyles={{
        padding: "0",
        margin: "0 auto",
        height: "auto",
        fontFamily: "Poppins, sans-serif"
      }}
      dividerStyles={{
        mt: "0.5rem"
      }}
      pageHead={translateText(["head"])}
    >
      <form onSubmit={() => {}}>
        <Grid
          container
          spacing={2}
          sx={{
            mb: "2rem"
          }}
        >
          {isPeopleManager && (
            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
              <InputField
                label={translateText(["employeeNo"])}
                inputType="text"
                value={""}
                placeHolder={translateText(["enterEmployeeNo"])}
                onChange={() => {}}
                inputName="employeeNumber"
                error={""}
                componentStyle={{
                  mt: "0rem"
                }}
                readOnly={isManager || isProfileView || isInputsDisabled}
                maxLength={10}
                isDisabled={isInputsDisabled}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["workEmail"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterWorkEmail"])}
              onChange={() => {}}
              inputName="workEmail"
              error={""}
              componentStyle={{
                mt: "0rem"
              }}
              required={!isManager && !isProfileView}
              readOnly={
                (isManager || isUpdate || isProfileView || isInputsDisabled) &&
                !isPendingInvitationListOpen
              }
              isDisabled={isInputsDisabled}
              maxLength={100}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <DropdownList
              inputName="employmentAllocation"
              label={translateText(["employmentAllocation"])}
              value={""}
              placeholder={translateText(["selectEmploymentAllocation"])}
              onChange={() => {}}
              error={""}
              componentStyle={{
                mt: "0rem"
              }}
              errorFocusOutlineNeeded={false}
              itemList={EmployementAllocationList}
              readOnly={isManager || isProfileView}
              isDisabled={isInputsDisabled}
              checkSelected
            />
          </Grid>

          <Grid
            size={{ xs: 12, md: 6, xl: 4 }}
            // sx={{
            //   display: isManager && values.teams.length === 0 ? "none" : "block"
            // }}
          >
            {projectTeamList?.length === 0 && !isManager && !isProfileView ? (
              <InteractiveInputTrigger
                id="add-new-team-button"
                label={translateText(["teams"])}
                placeholder={translateText(["addNewTeam"])}
                componentStyle={{ mt: "0rem" }}
                fieldButtonAction={() => {}}
                error={""}
                isDisable={isInputsDisabled}
              />
            ) : isManager || isProfileView ? (
              <MultiSelectChipInput
                chipList={[]}
                chipWrapperStyles={{
                  borderWidth: 0
                }}
                chipStyles={{
                  backgroundColor: "common.white",
                  color: theme.palette.grey[700],
                  borderWidth: 0,
                  borderColor: "common.white",
                  fontWeight: 400,
                  fontSize: "1rem",
                  height: "max-content"
                }}
                hiddenChipStyles={{
                  borderWidth: 0,
                  backgroundColor: theme.palette.grey[100],
                  fontWeight: 400,
                  fontSize: "1rem",
                  height: "max-content"
                }}
                label={translateText(["teams"])}
              />
            ) : (
              <MultivalueDropdownList
                inputName="teams"
                label={translateText(["teams"])}
                isMultiValue
                value={[]}
                placeholder={translateText(["selectTeams"])}
                onChange={() => {}}
                error={""}
                componentStyle={{
                  mt: "0rem"
                }}
                onAddNewClickBtn={() => {}}
                isCheckSelected
                isErrorFocusOutlineNeeded={false}
                itemList={projectTeamList}
                isDisabled={isManager || isProfileView || isInputsDisabled}
                addNewClickBtnText={translateText(["addNewTeam"])}
              />
            )}
          </Grid>

          <Grid
            size={{ xs: 12, md: 6, xl: 4 }}
            sx={{ display: isEmployee ? "none" : "block" }}
          >
            <AvatarSearch
              id="primary-manager-search"
              title={translateText(["primarySupervisor"])}
              newResourceManager={undefined}
              isManagerPopperOpen={isPrimaryManagerPopperOpen}
              managerSuggestions={[]}
              managerSearchTerm={""}
              handleManagerRemove={async () => {}}
              handleManagerSelect={async () => {}}
              setIsManagerPopperOpen={setIsPrimaryManagerPopperOpen}
              onManagerSearchChange={async () => {}}
              errors={""}
              inputName={"primarySupervisor"}
              isDisabled={isManager || isProfileView || isInputsDisabled}
              placeholder={
                !isManager && !isProfileView
                  ? translateText(["selectPrimarySupervisor"])
                  : ""
              }
              needSearchIcon={!isManager && !isProfileView}
              noSearchResultTexts={translateText(["noSearchResults"])}
              isDisabledLabel={isInputsDisabled}
              componentStyle={{
                width: "100%"
              }}
            />
          </Grid>

          <Grid
            size={{ xs: 12, md: 6, xl: 4 }}
            sx={{ display: isEmployee ? "none" : "block" }}
          >
            <AvatarSearch
              id="secondary-manager-search"
              title={translateText(["secondarySupervisor"])}
              newResourceManager={undefined}
              isManagerPopperOpen={isSecondaryManagerPopperOpen}
              managerSuggestions={[]}
              managerSearchTerm={""}
              handleManagerRemove={async () => {}}
              handleManagerSelect={async () => {}}
              setIsManagerPopperOpen={setIsSecondaryManagerPopperOpen}
              onManagerSearchChange={async () => {}}
              errors={""}
              inputName={"secondarySupervisor"}
              isDisabled={isManager || isProfileView || isInputsDisabled}
              isDisabledLabel={isInputsDisabled}
              placeholder={
                !isManager && !isProfileView
                  ? translateText(["selectSecondarySupervisor"])
                  : ""
              }
              needSearchIcon={!isManager && !isProfileView}
              noSearchResultTexts={translateText(["noSearchResults"])}
            />
          </Grid>
          {isPeopleManager && (
            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
              <InputDate
                label={translateText(["joinedDate"])}
                placeholder={translateText(["selectJoinedDate"])}
                value={DateTime.fromISO("")}
                onchange={() => {}}
                error={""}
                // minDate={}
                maxDate={DateTime.fromISO(new Date().toISOString())}
                componentStyle={{
                  mt: "0rem"
                }}
                inputFormat="dd/MM/yyyy"
                readOnly={isManager || isProfileView}
                disabled={isInputsDisabled}
                selectedDate={selectedJoinedDate}
                setSelectedDate={setSelectedJoinedDate}
              />
            </Grid>
          )}
          {isPeopleManager && (
            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
              <InputDate
                label={translateText(["probationStartDate"])}
                placeholder={
                  !isManager && !isProfileView
                    ? translateText(["selectProbationStartDate"])
                    : ""
                }
                value={DateTime.fromISO("")}
                onchange={() => {}}
                // minDate={}
                error={""}
                inputFormat="dd/MM/yyyy"
                componentStyle={{
                  mt: "0rem"
                }}
                readOnly={isManager || isProfileView}
                disableMaskedInput
                disabled={isInputsDisabled}
                selectedDate={selectedProbationStartDate}
                setSelectedDate={setSelectedProbationStartDate}
              />
            </Grid>
          )}
          {isPeopleManager && (
            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
              <InputDate
                label={translateText(["probationEndDate"])}
                placeholder={
                  !isManager && !isProfileView
                    ? translateText(["selectProbationEndDate"])
                    : ""
                }
                value={DateTime.fromISO("")}
                onchange={() => {}}
                // minDate={}
                error={""}
                inputFormat={REVERSE_DATE_FORMAT}
                componentStyle={{
                  mt: "0rem"
                }}
                readOnly={isManager || isProfileView}
                disabled={isInputsDisabled}
                selectedDate={selectedProbationEndDate}
                setSelectedDate={setSelectedProbationEndDate}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <DropdownAutocomplete
              itemList={timeZonesList}
              inputName="workTimeZone"
              label={translateText(["workTimeZone"])}
              value={{ label: "", value: "" }}
              placeholder={translateText(["selectWorkTimeZone"])}
              onChange={() => {}}
              error={""}
              isDisableOptionFilter={true}
              componentStyle={{
                mt: "0rem"
              }}
              isDisabled={isInputsDisabled}
              readOnly={isManager}
            />
          </Grid>
        </Grid>
        {!isManager && !isProfileView && (
          <TeamModalController setLatestTeamId={setLatestTeamId} />
        )}
      </form>
    </PeopleFormSectionWrapper>
  );
};

export default EmploymentDetailsSection;

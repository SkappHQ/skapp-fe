import { Checkbox, Grid2 as Grid, Typography, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InteractiveInputTrigger from "~community/common/components/molecules/InteractiveInputTrigger/InteractiveInputTrigger";
import {
  ButtonSizes,
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { DropdownListType } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { useGetPreprocessedRoles } from "~community/people/api/PeopleApi";
import { JobFamilyActionModalEnums } from "~community/people/enums/JobFamilyEnums";
import { usePeopleStore } from "~community/people/store/store";
import { JobFamilies } from "~community/people/types/JobRolesTypes";
import { EmployeeTypesList } from "~community/people/utils/data/employeeSetupStaticData";

import JobFamilyModalController from "../../JobFamilyModalController/JobFamilyModalController";
import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isManager?: boolean;
  isProfileView?: boolean;
  isInputsDisabled?: boolean;
}

const CareerProgressDetailsSection = ({
  isManager = false,
  isProfileView = false,
  isInputsDisabled = false
}: Props) => {
  const theme = useTheme();
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "careerDetails"
  );
  const translateButtonText = useTranslator(
    "peopleModule",
    "addResource",
    "entitlementDetails"
  );

  const { setIsJobFamilyModalOpen, setJobFamilyModalType } = usePeopleStore(
    (state) => state
  );

  const [jobTitle, setJobTitle] = useState<DropdownListType[]>([]);
  const [rowEdited, setRowEdited] = useState(-1);
  const [latestRoleLabel, setLatestRoleLabel] = useState<number>();
  const [selectedStartDate, setSelectedStartDate] = useState<
    DateTime | undefined
  >(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<DateTime | undefined>(
    undefined
  );

  const getPreprocessedRoles = useGetPreprocessedRoles();

  let jobFamilies: JobFamilies[] = useMemo(() => {
    return [];
  }, []);

  if (!isManager && !isProfileView) {
    const { data } = getPreprocessedRoles;
    jobFamilies = (data as JobFamilies[]) ?? [];
  }

  const jobFamiliesList = useMemo(() => {
    return (
      jobFamilies?.map((jobFamily: JobFamilies) => ({
        label: jobFamily.name,
        value: jobFamily.jobFamilyId || ""
      })) ?? []
    );
  }, [jobFamilies]);

  const jobTitleList = useMemo(() => {
    if (!jobTitle || jobTitle.length === 0) {
      return [
        {
          label: "",
          value: ""
        }
      ];
    }

    return jobTitle.map((jobTitle) => ({
      label: jobTitle.label,
      value: jobTitle.value as number
    }));
  }, [jobTitle]);

  return (
    <PeopleFormSectionWrapper
      title={translateText(["title"])}
      containerStyles={{
        padding: "0",
        margin: "0 auto",
        fontFamily: "Poppins, sans-serif",
        display:
          isManager || isProfileView
            ? // &&
              // employeeCareerDetails?.positionDetails?.length === 0
              "none"
            : "block"
      }}
      dividerStyles={{
        mt: "0.5rem",
        display:
          isManager || isProfileView
            ? // &&
              // employeeCareerDetails?.positionDetails?.length === 0
              "none"
            : "block"
      }}
      pageHead={translateText(["head"])}
    >
      <>
        <Grid
          container
          spacing={2}
          sx={{
            mb: "2rem"
          }}
        >
          {!isManager && !isProfileView && (
            <>
              <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <DropdownList
                  inputName="employeeType"
                  label={translateText(["employmentType"])}
                  value={""}
                  placeholder={translateText(["enterEmploymentType"])}
                  onChange={() => {}}
                  onInput={() => {}}
                  error={""}
                  componentStyle={{
                    mt: "0rem"
                  }}
                  errorFocusOutlineNeeded={false}
                  itemList={EmployeeTypesList}
                  checkSelected={true}
                  isDisabled={isInputsDisabled}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                {jobFamiliesList?.length === 0 ? (
                  <InteractiveInputTrigger
                    id="add-new-job-title-button"
                    label={translateText(["jobFamily"])}
                    placeholder={translateText(["selectJobFamily"])}
                    componentStyle={{ mt: "0rem" }}
                    fieldButtonAction={() => {
                      setIsJobFamilyModalOpen(true);
                      setJobFamilyModalType(
                        JobFamilyActionModalEnums.ADD_JOB_FAMILY
                      );
                    }}
                  />
                ) : (
                  <DropdownList
                    inputName="jobFamily"
                    label={translateText(["jobFamily"])}
                    value={""}
                    placeholder={translateText(["selectJobFamily"])}
                    onChange={() => {}}
                    onInput={() => {}}
                    error={""}
                    componentStyle={{ mt: "0rem" }}
                    errorFocusOutlineNeeded={false}
                    itemList={jobFamiliesList}
                    checkSelected={true}
                    isDisabled={isInputsDisabled}
                    addNewClickBtnText={translateText(["addJobFamily"])}
                    onAddNewClickBtn={() => {
                      setIsJobFamilyModalOpen(true);
                      setJobFamilyModalType(
                        JobFamilyActionModalEnums.ADD_JOB_FAMILY
                      );
                    }}
                  />
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <DropdownList
                  label={translateText(["jobTitle"])}
                  inputName="jobTitle"
                  placeholder={translateText(["selectJobTitle"])}
                  value={""}
                  onChange={() => {}}
                  onInput={() => {}}
                  error={""}
                  componentStyle={{
                    mt: "0rem"
                  }}
                  errorFocusOutlineNeeded={false}
                  itemList={jobTitleList}
                  isDisabled={isInputsDisabled}
                  checkSelected={true}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <InputDate
                  label={translateText(["startDate"])}
                  value={DateTime.fromISO("")}
                  onchange={() => {}}
                  placeholder={translateText(["selectStartDate"])}
                  error={""}
                  componentStyle={{
                    mt: "0rem"
                  }}
                  //   minDate={DateTime.fromISO(
                  //     employeeEmploymentDetails?.joinedDate ?? ""
                  //   )}
                  inputFormat="dd/MM/yyyy"
                  disableMaskedInput
                  disabled={isInputsDisabled}
                  selectedDate={selectedStartDate}
                  setSelectedDate={setSelectedStartDate}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <InputDate
                  label={translateText(["endDate"])}
                  value={DateTime.fromISO("")}
                  onchange={() => {}}
                  placeholder={translateText(["selectEndDate"])}
                  error={""}
                  componentStyle={{
                    mt: "0rem"
                  }}
                  inputFormat="dd/MM/yyyy"
                  disabled={isInputsDisabled}
                  disableMaskedInput
                  selectedDate={selectedEndDate}
                  setSelectedDate={setSelectedEndDate}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                {!isInputsDisabled && (
                  <Button
                    label={
                      rowEdited > -1
                        ? translateButtonText(["saveChanges"])
                        : translateButtonText(["add"])
                    }
                    onClick={() => {}}
                    endIcon={
                      rowEdited > -1 ? IconName.TICK_ICON : IconName.ADD_ICON
                    }
                    isFullWidth={false}
                    buttonStyle={ButtonStyle.SECONDARY}
                    size={ButtonSizes.MEDIUM}
                    styles={{
                      mt: "2rem"
                    }}
                    type={ButtonTypes.SUBMIT}
                    disabled={isInputsDisabled}
                  />
                )}
              </Grid>

              <Grid
                container
                alignItems="center"
                sx={{
                  mb: "-1rem"
                }}
                size={{ xs: 12, md: 6, xl: 4 }}
              >
                <Checkbox
                  //   checked={}
                  onChange={() => {}}
                  name="currentPosition"
                  color="primary"
                  sx={{
                    ml: "-0.5rem",
                    color: theme.palette.primary.main
                  }}
                  disabled={isInputsDisabled}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: isInputsDisabled ? theme.palette.text.disabled : ""
                  }}
                >
                  {translateText(["currentEmployment"])}
                </Typography>
              </Grid>
            </>
          )}
          {/* {employeeCareerDetails?.positionDetails.length === 0 ? null : (
            <PeopleFormTable
              data={
                !isManager && !isProfileView
                  ? formatData(copyOfData)
                  : formatData(copyOfEmployeeCareerDetails)
              }
              actionsNeeded={!isManager && !isProfileView && !isInputsDisabled}
              onEdit={handleEdit}
              onDelete={handleDelete}
              headings={tableHeaders}
              tableStyles={{
                mt: "2rem"
              }}
            />
          )} */}
        </Grid>
        <JobFamilyModalController
          setLatestRoleLabel={setLatestRoleLabel}
          from="add-new-resource"
        />
      </>
    </PeopleFormSectionWrapper>
  );
};

export default CareerProgressDetailsSection;

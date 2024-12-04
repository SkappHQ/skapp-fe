import { Box, Divider, Stack, SxProps, Typography } from "@mui/material";
import { FC, MouseEvent, useEffect } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Avatar from "~community/common/components/molecules/Avatar/Avatar";
import Dropdown from "~community/common/components/molecules/Dropdown/Dropdown";
import {
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { StyleProps } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { usePeopleStore } from "~community/people/store/store";
import {
  JobFamilyDropDownType,
  JobFamilyEmployeeDataType,
  JobTitleType,
  TransferMemberFormType
} from "~community/people/types/JobFamilyTypes";
import {
  getEmployeeDetails,
  getJobTitlesWithJobFamilyId
} from "~community/people/utils/jobFamilyUtils/commonUtils";
import { handleJobFamilyDropDownItemClick } from "~community/people/utils/jobFamilyUtils/jobFamilyUtils";
import { handleJobTitleDropDownItemClick } from "~community/people/utils/jobFamilyUtils/jobTitleUtils";

import styles from "./styles";

interface Props {
  jobFamilyTransfer: boolean;
  description: string;
  initialValues: TransferMemberFormType[] | undefined;
  jobFamily: JobFamilyDropDownType[] | undefined;
  employees: JobFamilyEmployeeDataType[] | undefined;
  handleSubmit: (values: any) => void;
  handleCancel: () => void;
  primaryBtnText: string;
  jobTitleId?: number;
}

const TransferMembersModal: FC<Props> = ({
  jobFamilyTransfer,
  description,
  initialValues,
  jobFamily,
  employees,
  handleSubmit,
  handleCancel,
  primaryBtnText,
  jobTitleId
}) => {
  const classes = styles();

  const translateText = useTranslator("peopleModule", "jobFamily");

  const {
    currentTransferMembersData: values,
    allJobFamilies,
    setCurrentTransferMembersData: setValues
  } = usePeopleStore((state) => state);

  useEffect(() => {
    const dataToSet = values ?? initialValues;
    if (dataToSet) {
      setValues(dataToSet);
    }
  }, [initialValues, values, setValues]);

  return (
    <Stack sx={classes.wrapper}>
      <Typography>{description}</Typography>
      <Stack sx={classes.contentWrapper}>
        <Stack sx={classes.textWrapper}>
          <Typography
            variant="body1"
            sx={{ ...classes.membersCell } as SxProps}
          >
            {translateText(["member"])}
          </Typography>
          <Typography
            variant="body1"
            sx={
              {
                ...classes.dropDownCell
              } as SxProps
            }
          >
            {translateText(["jobFamily"])}
          </Typography>
          <Typography
            variant="body1"
            sx={
              {
                ...classes.dropDownCell
              } as SxProps
            }
          >
            {translateText(["jobTitle"])}
          </Typography>
        </Stack>
        <Divider sx={classes.divider} />
        <Stack sx={classes.bodyWrapper}>
          <Stack sx={classes.bodyContainer}>
            {values?.map((member: TransferMemberFormType) => {
              const employee = getEmployeeDetails(
                member?.employeeId,
                employees
              );

              return (
                <Stack key={employee?.employeeId} sx={classes.textWrapper}>
                  <Box sx={classes.membersCell}>
                    <Avatar
                      firstName={employee?.firstName ?? ""}
                      lastName={employee?.lastName ?? ""}
                      src={employee?.authPic ?? ""}
                    />
                    <Typography
                      variant="body1"
                      sx={
                        {
                          ...classes.membersName,
                          ...classes.seeMoreStyles
                        } as SxProps
                      }
                    >
                      {`${employee?.firstName} ${employee?.lastName}`}
                    </Typography>
                  </Box>
                  <Box sx={classes.dropDownCell}>
                    <Dropdown
                      title={
                        member.jobFamily?.name ??
                        translateText(["jobFamilyDropDownPlaceholder"])
                      }
                      items={jobFamily ?? []}
                      onItemClick={(
                        _event: MouseEvent<HTMLElement>,
                        item: JobFamilyDropDownType
                      ) =>
                        handleJobFamilyDropDownItemClick(
                          employee?.employeeId,
                          item,
                          values,
                          setValues
                        )
                      }
                      displayKey="name"
                      selectedItem={member?.jobFamily as JobFamilyDropDownType}
                      dropdownBtnStyles={
                        classes.dropdownBtnStyles as StyleProps
                      }
                      textStyles={
                        {
                          ...classes.dropDownTextStyles,
                          ...classes.seeMoreStyles
                        } as StyleProps
                      }
                      disabled={!jobFamilyTransfer}
                    />
                  </Box>
                  <Box sx={classes.dropDownCell}>
                    <Dropdown
                      title={
                        member.jobTitle?.name ??
                        translateText(["jobTitleDropDownPlaceholder"])
                      }
                      disabled={!member.jobFamily?.jobFamilyId}
                      items={getJobTitlesWithJobFamilyId(
                        jobFamilyTransfer,
                        allJobFamilies,
                        member.jobFamily?.jobFamilyId ?? 0,
                        jobTitleId
                      )}
                      onItemClick={(
                        _event: MouseEvent<HTMLElement>,
                        item: JobTitleType
                      ) =>
                        handleJobTitleDropDownItemClick(
                          employee?.employeeId,
                          item,
                          values,
                          setValues
                        )
                      }
                      displayKey="name"
                      selectedItem={member.jobTitle as JobTitleType}
                      dropdownBtnStyles={
                        classes.dropdownBtnStyles as StyleProps
                      }
                      textStyles={
                        {
                          ...classes.dropDownTextStyles,
                          ...classes.seeMoreStyles
                        } as StyleProps
                      }
                    />
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
      <Button
        type={ButtonTypes.SUBMIT}
        label={primaryBtnText}
        buttonStyle={ButtonStyle.ERROR}
        endIcon={IconName.RIGHT_ARROW_ICON}
        onClick={() => handleSubmit(values)}
      />
      <Button
        label={translateText(["backBtnText"])}
        buttonStyle={ButtonStyle.TERTIARY}
        startIcon={IconName.LEFT_ARROW_ICON}
        onClick={handleCancel}
      />
    </Stack>
  );
};

export default TransferMembersModal;

import { Box, InputAdornment, Stack, Theme, useTheme } from "@mui/material";
import { FormikErrors, FormikState } from "formik";
import { JSX, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { characterLengths } from "~community/common/constants/stringConstants";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { usePeopleStore } from "~community/people/store/store";
import {
  AddJobFamilyFormType,
  JobTitleType
} from "~community/people/types/JobFamilyTypes";
import {
  getJobTitleNameError,
  handleBinIconBtnClick,
  handleCloseIconBtnClick,
  handleEditIconBtnClick,
  handleJobTitleAddBtnClick,
  handleJobTitleFieldKeyDown,
  handleJobTitleInputChange,
  handleJobTitleNameChange,
  handleTickIconBtnClick
} from "~community/people/utils/jobFamilyUtils/jobTitleFieldUtils";

import styles from "./styles";

interface Props {
  formik: FormikState<AddJobFamilyFormType> & {
    errors: FormikErrors<AddJobFamilyFormType>;
    setFieldError: (field: string, value: string | undefined) => void;
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void;
  };
  isAdmin?: boolean;
}

const JobTitleField = ({ formik, isAdmin }: Props): JSX.Element => {
  const translateText = useTranslator("peopleModule", "jobFamily");

  const theme: Theme = useTheme();
  const classes = styles();

  const {
    allJobFamilies,
    previousJobTitleData,
    setPreviousJobTitleData,
    setJobFamilyModalType
  } = usePeopleStore((state) => state);

  const { values, errors, setFieldValue, setFieldError } = formik;

  const [hoveredInputField, setHoveredInputField] = useState<number | null>(
    null
  );
  const [editingInputField, setEditingInputField] = useState<number | null>(
    null
  );

  return (
    <Stack>
      {isAdmin && (
        <Stack sx={classes.fieldWrapper}>
          <InputField
            id="job-title-input"
            inputName="jobTitleInput"
            label={translateText(["jobTitleInputField.label"])}
            placeHolder={translateText(["jobTitleInputField.placeholder"])}
            error={errors.jobTitleInput}
            value={values.jobTitleInput}
            isDisabled={!values.name}
            onKeyDown={(event) =>
              !errors.jobTitleInput
                ? handleJobTitleFieldKeyDown(
                    event,
                    values,
                    setFieldValue,
                    setFieldError
                  )
                : undefined
            }
            onChange={(event) =>
              handleJobTitleInputChange(event, setFieldValue)
            }
            componentStyle={classes.jobTitleInputField}
            maxLength={characterLengths.JOB_TITLE_LENGTH}
          />
          <IconButton
            icon={<Icon name={IconName.ADD_ICON} />}
            buttonStyles={classes.addIconBtn}
            onClick={async () => {
              if (values.name && values.jobTitleInput.trim() === "") {
                setFieldError(
                  "jobTitleInput",
                  translateText(["jobTitleInputField.noValueEnteredError"])
                );
              } else if (!errors.jobTitleInput) {
                await handleJobTitleAddBtnClick(
                  values,
                  setFieldValue,
                  setFieldError
                );
              }
            }}
          />
        </Stack>
      )}
      {values.jobTitles && (
        <Box sx={classes.scrollContainer}>
          <Box sx={classes.valueContainer}>
            {values.jobTitles?.map((jobTitle: JobTitleType, index: number) => {
              const isOldValue = jobTitle.jobTitleId !== null;
              const isHovered = hoveredInputField === index;
              const isEditing = editingInputField === index;

              const error = getJobTitleNameError(errors, index);

              return (
                <InputField
                  focusOnText
                  isDisabled={!isEditing}
                  key={index}
                  id={`job-title.[${index}].name`}
                  inputName={`jobTitles.${index}.name`}
                  value={jobTitle.name}
                  error={error}
                  onChange={(event) =>
                    handleJobTitleNameChange(
                      event,
                      index,
                      setFieldValue,
                      setFieldError
                    )
                  }
                  inputStyle={classes.inputFieldComponent}
                  maxLength={characterLengths.JOB_TITLE_LENGTH}
                  onMouseEnter={() => setHoveredInputField(index)}
                  onMouseLeave={() => setHoveredInputField(null)}
                  endAdornment={
                    isAdmin ? (
                      <InputAdornment
                        position="end"
                        sx={classes.inputAdornment}
                      >
                        {isOldValue && isHovered && !isEditing && (
                          <Icon
                            name={IconName.EDIT_ICON}
                            id={`${index}-edit-btn`}
                            fill={theme.palette.grey[700]}
                            onClick={() =>
                              handleEditIconBtnClick(
                                jobTitle,
                                setEditingInputField,
                                hoveredInputField,
                                setPreviousJobTitleData
                              )
                            }
                          />
                        )}
                        {isHovered && !isEditing && (
                          <Icon
                            name={IconName.BIN_ICON}
                            id={`${index}-bin-btn`}
                            fill={theme.palette.grey[700]}
                            onClick={() =>
                              handleBinIconBtnClick(
                                jobTitle,
                                setPreviousJobTitleData,
                                setFieldValue,
                                values,
                                allJobFamilies,
                                setJobFamilyModalType
                              )
                            }
                          />
                        )}
                        {isOldValue && isEditing && (
                          <>
                            <Icon
                              name={IconName.TICK_ICON}
                              id={`${index}-check-btn`}
                              height="1.25rem"
                              width="1.25rem"
                              fill={theme.palette.grey[700]}
                              onClick={() =>
                                !error &&
                                handleTickIconBtnClick(
                                  index,
                                  values,
                                  previousJobTitleData,
                                  allJobFamilies,
                                  setFieldValue,
                                  setJobFamilyModalType,
                                  setEditingInputField
                                )
                              }
                            />
                            <Icon
                              name={IconName.ROUNDED_CLOSE_ICON}
                              id={`${index}-close-btn`}
                              height="1.25rem"
                              width="1.25rem"
                              fill={theme.palette.grey[700]}
                              onClick={() =>
                                handleCloseIconBtnClick(
                                  index,
                                  previousJobTitleData,
                                  setFieldValue,
                                  setPreviousJobTitleData,
                                  setEditingInputField
                                )
                              }
                            />
                          </>
                        )}
                      </InputAdornment>
                    ) : null
                  }
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default JobTitleField;

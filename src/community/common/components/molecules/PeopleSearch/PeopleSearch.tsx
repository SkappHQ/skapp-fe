import {
  Box,
  InputBase,
  Paper,
  type SxProps,
  Typography
} from "@mui/material/";
import { type Theme, useTheme } from "@mui/material/styles";
import {
  ChangeEvent,
  Dispatch,
  FC,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Popper from "~community/common/components/molecules/Popper/Popper";
import { numericPatternWithSpaces } from "~community/common/regex/regexPatterns";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import { removeSpecialCharacters } from "~community/common/utils/commonUtil";
import { EmployeeType } from "~community/people/types/EmployeeTypes";

interface Props {
  id?: string;
  isPopperOpen: boolean;
  placeHolder?: string;
  label?: string;
  value?: string;
  error?: string;
  isAutoFocus?: boolean;
  isFullWidth?: boolean;
  suggestions?: EmployeeType[];
  selectedUsers?: EmployeeType[];
  labelStyles?: SxProps;
  componentStyles?: SxProps;
  searchBoxStyles?: SxProps;
  suggestionBoxStyles?: SxProps;
  suggestionStyles?: SxProps;
  isDisabled?: boolean;
  inputName?: string;
  popperStyles?: Record<string, string>;
  noSearchResultTexts?: string;
  noSearchResultTextStyles?: SxProps;
  parentRef?: RefObject<HTMLDivElement | null>;
  inputStyles?: SxProps;
  required?: boolean;
  needSearchIcon?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onSelectMember?: (user: EmployeeType) => void;
  setIsPopperOpen?: Dispatch<SetStateAction<boolean>>;
}

const PeopleSearch: FC<Props> = ({
  id,
  isPopperOpen,
  placeHolder,
  label,
  value,
  error,
  isFullWidth = true,
  isAutoFocus = false,
  suggestions,
  componentStyles,
  searchBoxStyles,
  labelStyles,
  suggestionBoxStyles,
  suggestionStyles,
  isDisabled,
  inputName,
  selectedUsers,
  popperStyles,
  noSearchResultTexts,
  noSearchResultTextStyles,
  parentRef,
  inputStyles,
  required = false,
  needSearchIcon = true,
  onBlur,
  onFocus,
  onChange,
  onSelectMember,
  setIsPopperOpen
}) => {
  const theme: Theme = useTheme();
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [isUserSelected, setIsUserSelected] = useState(false);

  useEffect(() => {
    if (value && !isDisabled && !isUserSelected) {
      if (value.length > 0) {
        setIsPopperOpen?.(true);
      } else {
        setIsPopperOpen?.(false);
      }
    } else {
      setIsPopperOpen?.(false);
    }
  }, [setIsPopperOpen, value, isDisabled, isUserSelected]);

  const handleSelectMember = (user: EmployeeType) => {
    if (onSelectMember) {
      setIsUserSelected(true);
      onSelectMember(user);
      setIsPopperOpen?.(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setIsUserSelected(false);
    if (onChange) {
      e.target.value = removeSpecialCharacters(e.target.value);
      if (
        numericPatternWithSpaces().test(e.target.value) ||
        e.target.value === ""
      ) {
        onChange(e);
      }
    }
  };

  return (
    <Box sx={{ my: "1.2rem", ...componentStyles }}>
      {label && (
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "500",
            fontSize: "1rem",
            color: (theme) =>
              error
                ? theme.palette.error.contrastText
                : isDisabled
                  ? theme.palette.text.disabled
                  : theme.palette.common.black,
            mb: "0.625rem",
            ...labelStyles
          }}
        >
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </Typography>
      )}
      <Box ref={ref}>
        <Box>
          <Paper
            component="div"
            elevation={0}
            sx={{
              p: "0.5rem 0.9375rem",
              display: "flex",
              alignItems: "center",
              background: error
                ? theme.palette.error.light
                : theme.palette.grey[100],
              borderRadius: "0.5rem",
              border: error
                ? `0.0625rem solid ${theme.palette.error.contrastText}`
                : "",
              ...searchBoxStyles
            }}
          >
            <InputBase
              id={id ?? "search-input"}
              sx={{
                flex: 1,
                "& input::placeholder": {
                  fontSize: "1rem"
                },
                ...inputStyles
              }}
              placeholder={placeHolder}
              fullWidth={isFullWidth}
              onChange={handleInputChange}
              value={value}
              disabled={isDisabled}
              autoFocus={isAutoFocus}
              onBlur={onBlur}
              onFocus={() => {
                if (onFocus) onFocus();
                setIsUserSelected(false);
              }}
              name={inputName}
            />
            {needSearchIcon && <Icon name={IconName.SEARCH_ICON} />}
          </Paper>
          {!!error && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.error.contrastText,
                fontSize: "0.875rem",
                mt: "0.5rem",
                lineHeight: "1rem"
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
      {(ref.current || parentRef) && !isDisabled && (
        <Popper
          open={isPopperOpen}
          anchorEl={parentRef ? parentRef.current : ref.current}
          position={"bottom-start"}
          menuType={MenuTypes.SEARCH}
          isManager={true}
          handleClose={() => setIsPopperOpen?.(false)}
          id={"suggestionPopper"}
          containerStyles={{ width: "100%", ...popperStyles }}
        >
          <Box
            sx={{
              backgroundColor:
                suggestions?.length === 0
                  ? theme.palette.common.white
                  : theme.palette.grey[100],
              borderRadius: "0.75rem",
              maxHeight: "11.25rem",
              overflowY: "auto",
              overflowX: "hidden",
              width: "100%",
              ...suggestionBoxStyles
            }}
          >
            {suggestions?.length === 0 && !error && (
              <Box
                sx={{
                  p: "1.25rem",
                  ...noSearchResultTextStyles
                }}
              >
                {noSearchResultTexts}
              </Box>
            )}
            {suggestions &&
              suggestions?.map((user) => {
                const isSearchResultInFilterArray = selectedUsers?.some(
                  (filterArrayElement) =>
                    parseInt(filterArrayElement?.employeeId?.toString()) ===
                    parseInt(user?.employeeId?.toString())
                );
                if (isSearchResultInFilterArray) {
                  return null;
                } else {
                  return (
                    <Box
                      key={user.employeeId}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        py: "0.5rem",
                        "&:hover": {
                          cursor: "pointer",
                          borderRadius: "0.75rem"
                        },
                        ...suggestionStyles
                      }}
                      onClick={() => handleSelectMember(user)}
                    >
                      <Box width="100%">
                        <AvatarChip
                          firstName={user?.firstName}
                          lastName={user?.lastName}
                          avatarUrl={user?.avatarUrl}
                          chipStyles={{
                            cursor: "pointer",
                            maxWidth: "fit-content"
                          }}
                        />
                      </Box>
                    </Box>
                  );
                }
              })}
          </Box>
        </Popper>
      )}
    </Box>
  );
};

export default PeopleSearch;

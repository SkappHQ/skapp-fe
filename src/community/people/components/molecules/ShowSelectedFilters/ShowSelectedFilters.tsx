import { useMediaQuery } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";

interface Props {
  filterOptions: string[];
  onDeleteIcon?: (label?: string) => void;
}

const ShowSelectedFilters = ({ filterOptions, onDeleteIcon }: Props) => {
  const theme: Theme = useTheme();
  const isMiniTabScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isTabScreen = useMediaQuery(theme.breakpoints.down("xl"));
  const visibleFilterCount = isMiniTabScreen ? 0 : isTabScreen ? 1 : 2;
  return (
    <>
      {filterOptions.length > 0 &&
        filterOptions
          ?.slice(0, visibleFilterCount)
          .map((option: string, index: number) => (
            <BasicChip
              key={index}
              label={option?.replace(/_/g, " ").toLowerCase()}
              chipStyles={{
                backgroundColor: theme.palette.grey[100],
                border: "0.0625rem solid",
                borderColor: "grey.500",
                textTransform: "capitalize",
                color: "common.black",
                px: "1rem",
                py: "0.4375rem",
                gap: "0.5rem",
                lineHeight: "1.0625rem"
              }}
              onDeleteIcon={() => onDeleteIcon && onDeleteIcon(option)}
            />
          ))}
      {filterOptions?.length > visibleFilterCount && (
        <BasicChip
          label={`+${String(filterOptions?.length - visibleFilterCount)}`}
          chipStyles={{
            backgroundColor: theme.palette.grey[100],
            border: "0.0625rem solid",
            borderColor: "grey.500",
            textTransform: "capitalize",
            color: "common.black",
            px: "1rem",
            py: "0.4375rem",
            lineHeight: "1.0625rem"
          }}
        />
      )}
    </>
  );
};

export default ShowSelectedFilters;

import { Stack } from "@mui/material";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { usePeopleStore } from "~community/people/store/store";
import { EmploymentAllocationTypes } from "~community/people/types/AddNewResourceTypes";
import {
  EmploymentStatusTypes,
  EmploymentTypes
} from "~community/people/types/EmployeeTypes";

import EmployeeFilterSection from "../EmployeeFilterSection/EmployeeFilterSection";

const EmployementSection = () => {
  const translateText = useTranslator(
    "peopleModule",
    "peoples.filters.employementFilters"
  );

  const { employeeDataFilter, setEmployeeDataFilter } = usePeopleStore(
    (state) => state
  );
  const filterData = [
    {
      title: "Employment Type",
      data: [
        { label: translateText(["intern"]), value: EmploymentTypes.INTERN },
        {
          label: translateText(["permenant"]),
          value: EmploymentTypes.PERMANENT
        },
        { label: translateText(["contract"]), value: EmploymentTypes.CONTRACT }
      ],
      filterKey: "employmentTypes"
    },
    {
      title: "Employment Allocation",
      data: [
        {
          label: translateText(["fullTime"]),
          value: EmploymentAllocationTypes.FULL_TIME
        },
        {
          label: translateText(["partTime"]),
          value: EmploymentAllocationTypes.PART_TIME
        }
      ],
      filterKey: "employmentAllocations"
    },
    {
      title: "Employment Status",
      data: [
        {
          label: translateText(["active"]),
          value: EmploymentStatusTypes.ACTIVE
        },
        {
          label: translateText(["terminated"]),
          value: EmploymentStatusTypes.TERMINATED
        },
        {
          label: translateText(["pending"]),
          value: EmploymentStatusTypes.PENDING
        }
      ],
      filterKey: "accountStatus"
    }
  ];

  const handleFilterChange = (
    value: string,
    filterKey: string,
    currentFilter: string[]
  ) => {
    if (!currentFilter.includes(value)) {
      setEmployeeDataFilter(filterKey, [...currentFilter, value]);
    } else {
      setEmployeeDataFilter(
        filterKey,
        currentFilter.filter((currentItem) => currentItem !== value)
      );
    }
  };

  return (
    <Stack
      sx={{
        overflowY: "auto",
        flexDirection: "column",
        maxHeight: "20rem"
      }}
    >
      {filterData.map((filter) => (
        <EmployeeFilterSection
          key={filter.title}
          title={filter.title}
          data={filter.data}
          filterKey={filter.filterKey}
          handleFilterChange={handleFilterChange}
          currentFilter={employeeDataFilter[filter.filterKey]}
        />
      ))}
    </Stack>
  );
};

export default EmployementSection;

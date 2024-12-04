import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import SearchBox from "~community/common/components/molecules/SearchBox/SearchBox";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes } from "~community/common/types/AuthTypes";
import { useGetAllJobFamilies } from "~community/people/api/JobFamilyApi";
import JobFamilyModalController from "~community/people/components/organisms/JobFamilyModalController/JobFamilyModalController";
import JobFamilyTable from "~community/people/components/organisms/JobFamilyTable/JobFamilyTable";
import { JobFamilyActionModalEnums } from "~community/people/enums/JobFamilyEnums";
import { usePeopleStore } from "~community/people/store/store";

const JobFamily: NextPage = () => {
  const translateText = useTranslator("peopleModule", "jobFamily");

  const { data: allJobFamiliesData, isPending: isJobFamilyPending } =
    useGetAllJobFamilies();

  const { data: session } = useSession();

  const isAdmin = session?.user?.roles?.includes(AdminTypes.PEOPLE_ADMIN);

  const { setAllJobFamilies, setJobFamilyModalType } = usePeopleStore();

  const [jobFamilySearchTerm, setJobFamilySearchTerm] = useState<string>("");

  useEffect(() => {
    setAllJobFamilies(allJobFamiliesData ?? []);
  }, [allJobFamiliesData, setAllJobFamilies]);

  return (
    <ContentLayout
      pageHead={translateText(["tabTitle"])}
      title={translateText(["title"])}
      isDividerVisible
      primaryButtonText={
        Boolean(allJobFamiliesData?.length ?? 0) &&
        isAdmin &&
        translateText(["addJobFamily"])
      }
      onPrimaryButtonClick={() =>
        setJobFamilyModalType(JobFamilyActionModalEnums.ADD_JOB_FAMILY)
      }
    >
      <>
        {allJobFamiliesData && allJobFamiliesData?.length > 0 && (
          <SearchBox
            value={jobFamilySearchTerm}
            setSearchTerm={setJobFamilySearchTerm}
            placeHolder={translateText(["jobFamilySearchPlaceholder"])}
          />
        )}
        <JobFamilyTable
          jobFamilySearchTerm={jobFamilySearchTerm}
          allJobFamilies={allJobFamiliesData}
          isJobFamilyPending={isJobFamilyPending}
        />
        <JobFamilyModalController />
      </>
    </ContentLayout>
  );
};

export default JobFamily;

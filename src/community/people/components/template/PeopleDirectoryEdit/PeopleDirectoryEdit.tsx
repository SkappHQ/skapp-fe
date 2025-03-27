import { useRouter } from "next/router";

import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";

import DirectoryEditSectionWrapper from "../../organisms/DirectoryEditSectionWrapper/DirectoryEditSectionWrapper";

const PeopleDirectoryEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <ContentLayout
      pageHead={""}
      title={""}
      isBackButtonVisible
      isDividerVisible={false}
    >
      <DirectoryEditSectionWrapper employeeId={Number(id)} />
    </ContentLayout>
  );
};

export default PeopleDirectoryEdit;

import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import useStepper from "~community/people/hooks/useStepper";

import DirectoryAddSectionWrapper from "../../organisms/DirectoryAddSectionWrapper/DirectoryAddSectionWrapper";

const PeopleDirectoryAdd = () => {
  const { activeStep, steps } = useStepper();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  return (
    <ContentLayout
      isBackButtonVisible
      isDividerVisible={true}
      title={translateText(["title"])}
      pageHead={translateText(["head"])}
      subtitleNextToTitle={`${activeStep + 1} ${translateText(["of"])} ${steps.length}`}
      onBackClick={() => {}}
      containerStyles={{
        overflowY: activeStep === 1 ? "unset" : "auto"
      }}
    >
      <DirectoryAddSectionWrapper />
    </ContentLayout>
  );
};

export default PeopleDirectoryAdd;

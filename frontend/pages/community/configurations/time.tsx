import { type NextPage } from "next";

import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import TimeConfigurations from "~community/configurations/components/organisms/TimeConfigurations/TimeConfigurations";

const Times: NextPage = () => {
  const translateText = useTranslator("configurations", "times");

  return (
    <ContentLayout
      pageHead={translateText(["pageHead"])}
      title={translateText(["title"])}
      isDividerVisible={true}
    >
      <TimeConfigurations />
    </ContentLayout>
  );
};

export default Times;

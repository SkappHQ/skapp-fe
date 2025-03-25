import { useRouter } from "next/router";

import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";

import AccountSectionWrapper from "../../organisms/AccountSectionWrapper/AccountSectionWrapper";

const PeopleAccount = () => {
  const router = useRouter();
  const { id } = router.query;

  // const {employeeId} = useSessionData()

  const translateText = useTranslator("peopleModule");

  //  handle go back and route change

  return (
    <ContentLayout
      onBackClick={() => {}}
      pageHead={translateText(["editAllInfo", "tabTitle"])}
      title={""}
    >
      <>
        <AccountSectionWrapper employeeId={Number(id)} />
      </>
    </ContentLayout>
  );
};

export default PeopleAccount;

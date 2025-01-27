import { NextPage } from "next";
import Head from "next/head";

import UpdatedPermissionsCard from "~community/common/components/atoms/UpdatedPermissionsCard/UpdatedPermissionsCard";
import { useTranslator } from "~community/common/hooks/useTranslator";

const Unauthorized: NextPage = () => {
  const translateText = useTranslator("unauthorized");

  return (
    <>
      <Head>
        <title>{translateText(["pageHead"])}</title>
      </Head>
      <UpdatedPermissionsCard />
    </>
  );
};
export default Unauthorized;

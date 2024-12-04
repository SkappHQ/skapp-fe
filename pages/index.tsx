import { GetServerSideProps } from "next";

import { redirectHandler } from "~community/common/utils/redirectionHandler";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await redirectHandler(context, {
    isSignInPage: false
  });
};

export default function Index() {
  return null;
}

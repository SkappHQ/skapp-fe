import { Box, Typography } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import ROUTES from "~community/common/constants/routes";
import {
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

const UpdatedPermissions: NextPage = () => {
  const translateText = useTranslator("unauthorized");
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{translateText(["pageHead"])}</title>
      </Head>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "1rem"
        }}
      >
        <Icon name={IconName.PERMISSIONS_UPDATE_ICON} />
        <Typography variant="h1" align="center">
          {translateText(["permissionsUpdateTitle"])}
        </Typography>
        <Box>
          <Typography variant="body1" align="center">
            {translateText(["permissionsUpdateDescription"])}
          </Typography>
        </Box>
        <Button
          label={translateText(["buttonText"])}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.RIGHT_ARROW_ICON}
          onClick={() => {
            router.push(ROUTES.AUTH.SIGNIN);
          }}
          type={ButtonTypes.BUTTON}
          styles={{
            mt: "1.5rem",
            width: "10%"
          }}
        />
      </Box>
    </>
  );
};
export default UpdatedPermissions;

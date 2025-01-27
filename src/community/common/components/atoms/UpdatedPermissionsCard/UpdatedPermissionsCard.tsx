import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import Icon from "~community/common/components/atoms/Icon/Icon";
import ROUTES from "~community/common/constants/routes";
import {
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

import Button from "../Button/Button";

const UpdatedPermissionsCard = () => {
  const translateText = useTranslator("unauthorized");
  const router = useRouter();

  return (
    <Stack
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.75rem",
        marginTop: { xs: "6.25rem", sm: "12.5rem" }
      }}
    >
      <Icon name={IconName.DENIED_ICON} />
      <Typography variant="h1" align="center">
        {translateText(["title"])}
      </Typography>
      <Stack
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography variant="body1" align="center">
          {"Some permissions have been updated. Please sign in again."}
        </Typography>
        <Button
          label={"Sign In"}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.RIGHT_ARROW_ICON}
          onClick={() => {
            router.push(ROUTES.AUTH.SIGNIN);
          }}
          type={ButtonTypes.BUTTON}
          styles={{
            mt: "1.5rem",
            width: "20%"
          }}
        />
      </Stack>
    </Stack>
  );
};

export default UpdatedPermissionsCard;

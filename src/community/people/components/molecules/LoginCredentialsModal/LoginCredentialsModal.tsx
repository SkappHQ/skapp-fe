import { Stack, Typography } from "@mui/material";

import Button from "~community/common/components/atoms/Button/Button";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { usePeopleStore } from "~community/people/store/store";

const LoginCredentialsModal = () => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "credentials"
  );
  const { sharedCredentialData } = usePeopleStore((state) => state);

  const firstName = sharedCredentialData?.firstName ?? "";
  const lastName = sharedCredentialData?.lastName ?? "";
  const employeeCredentials = sharedCredentialData?.employeeCredentials ?? {
    email: "",
    tempPassword: ""
  };

  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const baseUrl = `${url.protocol}//${url.host}`;
  const loginUrl = `${baseUrl}/signin`;

  const handleCopyText = () => {
    const textToCopy = [
      translateText(["sectionOne"]),
      translateText(["sectionTwo"], { name: userName() }),
      translateText(["sectionThree"]),
      translateText(["loginUrl"], { link: loginUrl }),
      translateText(["username"], { username: employeeCredentials.email }),
      translateText(["password"], {
        password: employeeCredentials.tempPassword
      }),
      translateText(["sectionFive"])
    ].join("\n");

    navigator.clipboard.writeText(textToCopy).catch((err) => {
      console.error("Failed to copy text", err);
    });
  };

  const userName = () => {
    return `${firstName} ${lastName}`.trim();
  };

  return (
    <Stack gap={3} marginTop={2}>
      <Typography>{translateText(["sectionOne"])}</Typography>

      <Typography>
        {translateText(["sectionTwo"], {
          name: userName() ?? ""
        })}
      </Typography>

      <Typography>{translateText(["sectionThree"])}</Typography>

      <Stack>
        <Typography>
          {translateText(["loginUrl"], { link: loginUrl })}
        </Typography>
        <Typography>
          {translateText(["username"], {
            username: employeeCredentials.email
          })}
        </Typography>
        <Typography>
          {translateText(["password"], {
            password: employeeCredentials.tempPassword
          })}
        </Typography>
      </Stack>

      <Typography>{translateText(["sectionFive"])}</Typography>

      <Button
        label={translateText(["copy"])}
        onClick={handleCopyText}
        endIcon={IconName.COPY_ICON}
      />
    </Stack>
  );
};

export default LoginCredentialsModal;

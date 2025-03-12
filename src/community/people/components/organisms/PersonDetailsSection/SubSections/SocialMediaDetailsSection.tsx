import { Facebook, Instagram, LinkedIn, X } from "@mui/icons-material";
import { Grid2 as Grid, type Theme, useTheme } from "@mui/material";

import InputField from "~community/common/components/molecules/InputField/InputField";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { SOCIAL_MEDIA_MAX_CHARACTER_LENGTH } from "~community/people/constants/configs";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isInputsDisabled?: boolean;
}
const SocialMediaDetailsSection = ({ isInputsDisabled }: Props) => {
  const theme: Theme = useTheme();
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "socialMediaDetails"
  );
  return (
    <PeopleFormSectionWrapper
      title={translateText(["title"])}
      containerStyles={{
        padding: "0",
        margin: "0 auto",
        height: "auto"
      }}
      dividerStyles={{
        mt: "0.5rem"
      }}
      pageHead={translateText(["head"])}
    >
      <form onSubmit={() => {}}>
        <Grid
          container
          spacing={2}
          sx={{
            mb: "2rem"
          }}
        >
          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["linkedIn"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterAccountUrl"])}
              startAdornment={
                <LinkedIn
                  sx={{
                    color: theme.palette.grey[700],
                    ml: "0.5rem"
                  }}
                />
              }
              onChange={() => {}}
              inputName="linkedIn"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              isDisabled={isInputsDisabled}
              maxLength={SOCIAL_MEDIA_MAX_CHARACTER_LENGTH}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["facebook"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterAccountUrl"])}
              startAdornment={
                <Facebook
                  sx={{
                    color: theme.palette.grey[700],
                    ml: "0.5rem"
                  }}
                />
              }
              onChange={() => {}}
              inputName="facebook"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              isDisabled={isInputsDisabled}
              maxLength={SOCIAL_MEDIA_MAX_CHARACTER_LENGTH}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["instagram"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterAccountUrl"])}
              startAdornment={
                <Instagram
                  sx={{
                    color: theme.palette.grey[700],
                    ml: "0.5rem"
                  }}
                />
              }
              onChange={() => {}}
              inputName="instagram"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              isDisabled={isInputsDisabled}
              maxLength={SOCIAL_MEDIA_MAX_CHARACTER_LENGTH}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["x"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterAccountUrl"])}
              startAdornment={
                <X
                  sx={{
                    color: theme.palette.grey[700],
                    ml: "0.5rem"
                  }}
                />
              }
              onChange={() => {}}
              inputName="x"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              isDisabled={isInputsDisabled}
              maxLength={SOCIAL_MEDIA_MAX_CHARACTER_LENGTH}
            />
          </Grid>
        </Grid>
      </form>
    </PeopleFormSectionWrapper>
  );
};

export default SocialMediaDetailsSection;

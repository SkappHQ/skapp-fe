import {
  Box,
  Container,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { JSX } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import OnboardingSplash from "~public/image/onboarding-splash.svg";

import { styles } from "./styles";

interface SignUpLayoutProps {
  heading: string;
  subheading?: string;
  children: React.ReactNode;
  subheadingStyle?: SxProps<Theme>;
  disabled?: boolean;
  onClick: () => void;
  buttonText: string;
  centerHeading?: boolean;
  isLoading?: boolean;
  showSignInLink?: boolean;
  buttonStyle?: ButtonStyle;
  startIcon?: IconName | JSX.Element | null;
  endIcon?: IconName | JSX.Element | null;
  centerContentY?: boolean;
}

const SignUpLayout: React.FC<SignUpLayoutProps> = ({
  heading,
  subheading,
  subheadingStyle,
  children,
  disabled = false,
  onClick,
  buttonText,
  centerHeading = false,
  isLoading = false,
  showSignInLink = false,
  buttonStyle = ButtonStyle.PRIMARY,
  startIcon = null,
  endIcon = null,
  centerContentY = false
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const classes = styles(theme, isSmallScreen);
  const translateText = useTranslator("onboarding", "organizationCreate");

  return (
    <Box sx={classes.container}>
      <Head>
        <title>{translateText(["pageHeader"])}</title>
      </Head>

      <Box
        sx={{
          ...classes.container
        }}
      >
        <Container
          sx={{
            ...classes.contentSection,
            justifyContent: centerContentY ? "center" : "flex-start"
          }}
        >
          <Box sx={classes.headerContainer}>
            <Typography
              variant="onboardingHeader"
              component="h1"
              sx={{
                ...classes.header,
                textAlign: centerHeading ? "center" : "left"
              }}
            >
              {heading}
            </Typography>
            {subheading && (
              <Typography variant="body1" sx={subheadingStyle}>
                {subheading}
              </Typography>
            )}
          </Box>

          {children}

          <Button
            label={buttonText}
            buttonStyle={buttonStyle}
            startIcon={startIcon}
            endIcon={endIcon}
            isFullWidth={false}
            styles={classes.button}
            onClick={onClick}
            disabled={disabled}
            isLoading={isLoading}
          />
          {showSignInLink && (
            <Typography variant="body2" sx={classes.signInText}>
              {translateText(["signInLinkInitial"])}{" "}
              <Link
                href="/signin"
                style={{
                  color: theme.palette.primary.dark,
                  textDecoration: "none",
                  marginLeft: "0.25rem"
                }}
              >
                {translateText(["signInBtnText"])}
              </Link>
            </Typography>
          )}
        </Container>
        <Box
          sx={{
            ...classes.imageContainer,
            width: {
              md: "40%"
            },
            [theme.breakpoints.down("md")]: {
              display: "none"
            }
          }}
        >
          <Image
            src={OnboardingSplash}
            alt="Onboarding Splash"
            layout="responsive"
            width={500}
            height={500}
            priority
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpLayout;

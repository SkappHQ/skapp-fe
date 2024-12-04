import {
  type PaletteOptions,
  type SimplePaletteColorOptions,
  type Theme,
  createTheme
} from "@mui/material/styles";

import { ThemeTypes } from "~community/common/types/AvailableThemeColors";

import { theme } from "./theme";
import {
  BLUE_THEME,
  GREEN_THEME,
  ORANGE_THEME,
  PURPLE_THEME,
  ROSE_THEME,
  YELLOW_THEME
} from "./themesData";

export const themeSelector = (color: string): Theme => {
  if (
    !Object.values(ThemeTypes)
      .map((type) => type.toUpperCase())
      .includes(color?.toUpperCase())
  )
    return muiThemeOverride(BLUE_THEME);
  for (const key in ThemeTypes) {
    if (Object.prototype.hasOwnProperty.call(ThemeTypes, key)) {
      const themeKey = key as keyof typeof ThemeTypes;
      if (ThemeTypes[themeKey].toUpperCase() === color.toUpperCase()) {
        switch (key) {
          case "YELLOW_THEME":
            return muiThemeOverride(YELLOW_THEME);
          case "BLUE_THEME":
            return muiThemeOverride(BLUE_THEME);
          case "ROSE_THEME":
            return muiThemeOverride(ROSE_THEME);
          case "GREEN_THEME":
            return muiThemeOverride(GREEN_THEME);
          case "PURPLE_THEME":
            return muiThemeOverride(PURPLE_THEME);
          case "ORANGE_THEME":
            return muiThemeOverride(ORANGE_THEME);
          default:
            return muiThemeOverride(BLUE_THEME);
        }
      }
    }
  }
  return muiThemeOverride(PURPLE_THEME);
};

const muiThemeOverride = (selectedTheme: Partial<PaletteOptions>): Theme => {
  return createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        ...theme.palette.primary,
        main: (selectedTheme?.primary as SimplePaletteColorOptions)?.main,
        dark: (selectedTheme.primary as SimplePaletteColorOptions).dark
      },
      secondary: {
        ...theme.palette.secondary,
        main: (selectedTheme.secondary as SimplePaletteColorOptions).main,
        dark: (selectedTheme.secondary as SimplePaletteColorOptions).dark
      }
    }
  });
};

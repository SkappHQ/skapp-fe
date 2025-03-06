import { IconName } from "../types/IconTypes";
import { parseHexToRgb } from "./commonUtil";

interface GetSelectionStatusIconProps {
  selected: boolean;
  isError: boolean | undefined;
}

export const getSelectionStatusIcon = ({
  selected,
  isError
}: GetSelectionStatusIconProps) => {
  if (selected) {
    return IconName.SUCCESS_ICON;
  } else if (isError) {
    return IconName.UNCHECKED_ICON;
  } else {
    return IconName.UNCHECKED_ICON;
  }
};

interface GetRgbForBlinkProps {
  isAnimationOn: boolean;
  color: string;
}

export const getRgbForBlink = ({
  isAnimationOn,
  color
}: GetRgbForBlinkProps) => {
  if (isAnimationOn) {
    const rgbValues = parseHexToRgb(color);

    return `${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`;
  }

  return "";
};

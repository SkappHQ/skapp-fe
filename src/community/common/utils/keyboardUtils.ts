import { KeyboardKeys } from "~community/common/enums/KeyboardEnums";

export const isKeyEventType = (pressedKey: string, keyType: KeyboardKeys) =>
  pressedKey === keyType;

export const isEnterKeyPress = (pressedKey: string) =>
  isKeyEventType(pressedKey, KeyboardKeys.ENTER);

export const isEscapeKeyPress = (pressedKey: string) =>
  isKeyEventType(pressedKey, KeyboardKeys.ESCAPE);

export const isArrowKeyPress = (pressedKey: string) =>
  [
    KeyboardKeys.ARROW_LEFT,
    KeyboardKeys.ARROW_RIGHT,
    KeyboardKeys.ARROW_UP,
    KeyboardKeys.ARROW_DOWN
  ].includes(pressedKey as KeyboardKeys);

export const isTabKeyPress = (pressedKey: string) =>
  isKeyEventType(pressedKey, KeyboardKeys.TAB);

export const isSpaceKeyPress = (pressedKey: string) =>
  isKeyEventType(pressedKey, KeyboardKeys.SPACE);

import {
  allowsLettersAndSpecialCharactersForNames,
  isValidEmail,
  specialCharacters
} from "~community/common/regex/regexPatterns";

export const nameValidation = {
  pattern: allowsLettersAndSpecialCharactersForNames(),
  maxLength: 50,
  validate: (value: string): string | null => {
    if (!value) {
      return "This field is required";
    }
    if (!nameValidation.pattern.test(value)) {
      return "Only letters, apostrophes, hyphens and accents are allowed";
    }
    if (value.length > nameValidation.maxLength) {
      return `Maximum ${nameValidation.maxLength} characters allowed`;
    }
    if (specialCharacters().test(value)) {
      return "Special characters are not allowed";
    }
    return null;
  }
};

export const emailValidation = {
  pattern: isValidEmail(),
  maxLength: 100,
  validate: (value: string): string | null => {
    if (!value) {
      return "Please enter work email";
    }
    if (!emailValidation.pattern.test(value)) {
      return "Please enter a valid email";
    }
    if (value.includes("..")) {
      return "Email cannot contain consecutive periods";
    }
    if (value.length > emailValidation.maxLength) {
      return `Maximum ${emailValidation.maxLength} characters allowed`;
    }
    return null;
  }
};

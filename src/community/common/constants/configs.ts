export enum ApiVersions {
  V1 = "/v1",
  V2 = "/v2"
}

export enum moduleAPIPath {
  AUTH = "/auth",
  PEOPLE = "/people",
  LEAVE = "/leave",
  JOB = "/job",
  TIME = "/time",
  ORGANIZATION = "/organization",
  ROLES = "/roles"
}

export enum nextAuthOptions {
  SESSION_STRATEGY = "jwt",
  SESSION_MAX_AGE = 24 * 60 * 60
}

export enum unitConversion {
  MILLISECONDS_PER_SECOND = 1000
}

export const DEFAULT_COUNTRY_CODE = "94";

export enum appModes {
  ENTERPRISE = "enterprise",
  COMMUNITY = "community"
}

export const DOMAIN = ".skapp.com";

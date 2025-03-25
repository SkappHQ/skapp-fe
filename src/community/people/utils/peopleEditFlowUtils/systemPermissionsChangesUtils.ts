import { L2SystemPermissionsType } from "~community/people/types/PeopleTypes";

import { isFieldDifferentAndValid } from "./personalDetailsChangesUtils";

export const getSystemPermissionsDetailsChanges = (
  newSystemPermissions: L2SystemPermissionsType,
  previousSystemPermissions: L2SystemPermissionsType
): L2SystemPermissionsType => {
  const changes: L2SystemPermissionsType = {};

  if (
    isFieldDifferentAndValid(
      newSystemPermissions?.isSuperAdmin,
      previousSystemPermissions?.isSuperAdmin
    )
  ) {
    changes.isSuperAdmin = newSystemPermissions?.isSuperAdmin;
  }

  if (
    isFieldDifferentAndValid(
      newSystemPermissions?.leaveRole,
      previousSystemPermissions?.leaveRole
    )
  ) {
    changes.leaveRole = newSystemPermissions?.leaveRole;
  }

  if (
    isFieldDifferentAndValid(
      newSystemPermissions?.attendanceRole,
      previousSystemPermissions?.attendanceRole
    )
  ) {
    changes.attendanceRole = newSystemPermissions?.attendanceRole;
  }

  if (
    isFieldDifferentAndValid(
      newSystemPermissions?.eSignRole,
      previousSystemPermissions?.eSignRole
    )
  ) {
    changes.eSignRole = newSystemPermissions?.eSignRole;
  }

  if (
    isFieldDifferentAndValid(
      newSystemPermissions?.peopleRole,
      previousSystemPermissions?.peopleRole
    )
  ) {
    changes.peopleRole = newSystemPermissions?.peopleRole;
  }

  return changes;
};

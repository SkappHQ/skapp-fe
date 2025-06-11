import { Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { formatDateWithOrdinalSuffix } from "~community/common/utils/dateTimeUtils";
import { LeaveEntitlementBalanceType } from "~community/leave/types/LeaveEntitlementTypes";

import styles from "./styles";

interface Props {
  leaveEntitlementBalance: LeaveEntitlementBalanceType[] | undefined;
}

const LeaveEntitlementBalanceCard = ({ leaveEntitlementBalance }: Props) => {
  const classes = styles();

  const translateText = useTranslator(
    "leaveModule",
    "myRequests",
    "leaveEntitlementBalanceCard"
  );

  const translateAria = useTranslator("leaveAria", "applyLeave", "calendar");

  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  const createAccessibleDescription = useCallback(() => {
    const availableLabel = translateText(["available"]);
    const effectiveFromLabel = translateText(["effectiveFrom"]);
    const expiredToLabel = translateText(["expiredTo"]);
    const descriptions = leaveEntitlementBalance
      ?.map((entitlement, _index) => {
        const available =
          entitlement.totalDaysAllocated - entitlement.totalDaysUsed;
        const total = entitlement.totalDaysAllocated;
        const validFrom = formatDateWithOrdinalSuffix(entitlement.validFrom);
        const validTo = formatDateWithOrdinalSuffix(entitlement.validTo);

        return `${availableLabel} ${available} / ${total}, ${effectiveFromLabel} ${validFrom}, ${expiredToLabel} ${validTo}`;
      })
      .join(". ");

    return descriptions;
  }, [leaveEntitlementBalance, translateText]);

  return (
    <Tooltip
      ariaLabel={translateAria(["icon"])}
      open={isTooltipOpen}
      id="leave-entitlement-balance-tooltip"
      dataTestId="leave-entitlement-balance-tooltip"
      spanStyles={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%" }}
      ariaDescription={createAccessibleDescription()}
      title={
        <Stack sx={classes.wrapper}>
          <Stack sx={classes.row}>
            <Typography variant="body2" align="center" sx={classes.text}>
              {translateText(["available"]) ?? ""}
            </Typography>
            <Typography variant="body2" align="center" sx={classes.text}>
              {translateText(["effectiveFrom"]) ?? ""}
            </Typography>
            <Typography variant="body2" align="center" sx={classes.text}>
              {translateText(["expiredTo"]) ?? ""}
            </Typography>
          </Stack>
          {leaveEntitlementBalance?.length !== 0 &&
            leaveEntitlementBalance?.map(
              (entitlement: LeaveEntitlementBalanceType, index: number) => (
                <Stack key={index} sx={classes.row}>
                  <Typography variant="body2" align="center" sx={classes.text}>
                    {entitlement.totalDaysAllocated - entitlement.totalDaysUsed}
                    /{entitlement.totalDaysAllocated}
                  </Typography>
                  <Typography variant="body2" align="center" sx={classes.text}>
                    {formatDateWithOrdinalSuffix(entitlement.validFrom)}
                  </Typography>
                  <Typography variant="body2" align="center" sx={classes.text}>
                    {formatDateWithOrdinalSuffix(entitlement.validTo)}
                  </Typography>
                </Stack>
              )
            )}
        </Stack>
      }
    >
      <Typography
        component="span"
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        <Icon name={IconName.INFORMATION_ICON} />
      </Typography>
    </Tooltip>
  );
};

export default LeaveEntitlementBalanceCard;

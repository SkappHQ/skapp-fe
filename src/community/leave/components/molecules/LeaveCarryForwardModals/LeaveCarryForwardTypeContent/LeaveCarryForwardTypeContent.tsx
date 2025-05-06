import { Box, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

import CloseIcon from "~community/common/assets/Icons/CloseIcon";
import Button from "~community/common/components/atoms/Button/Button";
import Checkbox from "~community/common/components/atoms/Checkbox/Checkbox";
import Icon from "~community/common/components/atoms/Icon/Icon";
import ROUTES from "~community/common/constants/routes";
import {
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { getEmoji } from "~community/common/utils/commonUtil";
import { useLeaveStore } from "~community/leave/store/store";
import { getTruncatedLabel } from "~community/leave/utils/leaveTypes/LeaveTypeUtils";

interface Props {
  handleClose: () => void;
}

const LeaveCarryForwardTypeContent = ({ handleClose }: Props): JSX.Element => {
  const router = useRouter();

  const translateTexts = useTranslator("leaveModule", "leaveCarryForward");

  const { leaveTypes } = useLeaveStore((state) => ({
    leaveTypes: state.leaveTypes
  }));

  const [checkedList, setCheckedList] = useState<number[]>([]);

  const handleCheck = (id: number) => {
    setCheckedList((prevCheckedList) =>
      prevCheckedList.includes(id)
        ? prevCheckedList.filter((item) => item !== id)
        : [...prevCheckedList, id]
    );
  };

  const handleCheckAll = () => {
    const allSelected = checkedList.length === leaveTypes.length;
    setCheckedList(allSelected ? [] : leaveTypes.map((leave) => leave.typeId));
  };

  const onSubmit = async () => {
    handleClose?.();
    router.push(ROUTES.LEAVE.CARRY_FORWARD_BALANCE.ID(checkedList.join(",")));
  };

  const { handleSubmit } = useFormik({
    initialValues: {
      leaveTypes: leaveTypes?.reduce(
        (acc, leaveType) => {
          acc[leaveType.typeId] = false;
          return acc;
        },
        {} as { [key: number]: boolean }
      )
    },
    onSubmit: onSubmit
  });

  return (
    <Stack
      sx={{
        padding: "0rem 0.25rem 1rem 0.25rem",
        minWidth: "31.25rem"
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: "grey.900",
          width: "100%"
        }}
      >
        {translateTexts(["leaveCarryForwardTypeSelectionModalDescription"]) ??
          ""}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          flexWrap: "wrap",
          maxHeight: "13.125rem",
          overflowY: "auto",
          marginTop: "0.5rem"
        }}
      >
        {leaveTypes?.length >= 2 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexBasis: "33.3333%",
              flexWrap: "wrap",
              width: "100%"
            }}
          >
            <Checkbox
              label={translateTexts(["selectAllText"])}
              name={translateTexts(["selectAllText"])}
              checked={checkedList?.length === leaveTypes?.length}
              onChange={handleCheckAll}
            />
          </Box>
        )}
        {leaveTypes?.map((leaveType) => (
          <Box
            key={leaveType.typeId}
            sx={{
              display: "flex",
              flexDirection: "column",
              flexBasis: "33.3333%",
              flexWrap: "wrap",
              width: "100%"
            }}
          >
            <Checkbox
              label={`${getEmoji(leaveType?.emojiCode || "")} ${getTruncatedLabel(
                leaveType?.name as string
              )}`}
              name={`leaveTypes[${leaveType.typeId}]`}
              checked={checkedList?.includes(leaveType.typeId)}
              onChange={() => handleCheck(leaveType.typeId)}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: "1rem" }}>
        <Button
          label={translateTexts(["leaveCarryForwardModalConfirmBtn"])}
          endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
          type={ButtonTypes.SUBMIT}
          onClick={() => handleSubmit()}
          disabled={checkedList.length === 0}
        />
        <Button
          label={translateTexts(["leaveCarryForwardModalCancelBtn"])}
          endIcon={<CloseIcon />}
          buttonStyle={ButtonStyle.TERTIARY}
          styles={{ mt: "1rem" }}
          type={ButtonTypes.BUTTON}
          onClick={handleClose}
        />
      </Box>
    </Stack>
  );
};

export default LeaveCarryForwardTypeContent;

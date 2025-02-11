import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";

const roleTitles = {
  peopleAdmin: "peopleAdminLimitationTitle",
  leaveAdmin: "leaveAdminLimitationTitle",
  attendanceAdmin: "attendanceAdminLimitationTitle",
  peopleManager: "peopleManagerLimitationTitle",
  leaveManager: "leaveManagerLimitationTitle",
  attendanceManager: "attendanceManagerLimitationTitle",
  esignAdmin: "eSignAdminLimitationTitle",
  esignSender: "eSignSenderLimitationTitle"
};

const roleDescriptions = {
  peopleAdmin: "peopleAdminLimitationDescription",
  leaveAdmin: "leaveAdminLimitationDescription",
  attendanceAdmin: "attendanceAdminLimitationDescription",
  peopleManager: "peopleManagerLimitationDescription",
  leaveManager: "leaveManagerLimitationDescription",
  attendanceManager: "attendanceManagerLimitationDescription",
  esignAdmin: "eSignAdminLimitationDescription",
  esignSender: "eSignSenderLimitationDescription"
};

export const setRoleLimitToastMessage = (
  setToastMessage: ReturnType<typeof useToast>["setToastMessage"],
  roleLimitationTexts: ReturnType<typeof useTranslator>,
  role: keyof typeof roleTitles
) => {
  setToastMessage({
    open: true,
    toastType: ToastType.ERROR,
    title: roleLimitationTexts([roleTitles[role]]),
    description: roleLimitationTexts([roleDescriptions[role]]),
    isIcon: true
  });
};

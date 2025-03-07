interface CommonEnterpriseStore {
  setGlobalLoginMethod: (value: string) => void;
  globalLoginMethod: string;
  ongoingQuickSetup: {
    INVITE_EMPLOYEES: boolean;
    DEFINE_TEAMS: boolean;
    DEFINE_JOB_FAMILIES: boolean;
    SETUP_HOLIDAYS: boolean;
    SETUP_LEAVE_TYPES: boolean;
  };
  setQuickSetupModalType: (value: string) => void;
  setStopAllOngoingQuickSetup: () => void;
}

export const useCommonEnterpriseStore = (
  arg0: (state: any) => any
): CommonEnterpriseStore => {
  return {
    setGlobalLoginMethod: () => {},
    globalLoginMethod: "",
    ongoingQuickSetup: {
      INVITE_EMPLOYEES: false,
      DEFINE_TEAMS: false,
      DEFINE_JOB_FAMILIES: false,
      SETUP_HOLIDAYS: false,
      SETUP_LEAVE_TYPES: false
    },
    setQuickSetupModalType: () => {},
    setStopAllOngoingQuickSetup: () => {}
  };
};

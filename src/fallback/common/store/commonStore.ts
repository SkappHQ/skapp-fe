interface CommonEnterpriseStore {
  setGlobalLoginMethod: (value: string) => void;
  globalLoginMethod: string;
}

export const useCommonEnterpriseStore = (
  arg0: (state: any) => any
): CommonEnterpriseStore => {
  return {
    setGlobalLoginMethod: () => {},
    globalLoginMethod: ""
  };
};

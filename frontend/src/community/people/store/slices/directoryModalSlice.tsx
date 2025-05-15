import { SetType } from "~community/common/types/storeTypes";
import {
  BulkEmployeeDetails,
  QuickAddEmployeeResponse
} from "~community/people/types/EmployeeTypes";
import { DirectoryModalTypes } from "~community/people/types/ModalTypes";
import { DirectoryModalSliceType } from "~community/people/types/SliceTypes";

export const directoryModalSlice = (
  set: SetType<DirectoryModalSliceType>
): DirectoryModalSliceType => ({
  isDirectoryModalOpen: false,
  directoryModalType: DirectoryModalTypes.NONE,
  bulkUploadUsers: [],
  sharedCredentialData: null,
  setIsDirectoryModalOpen: (value: boolean) =>
    set((state: DirectoryModalSliceType) => ({
      ...state,
      isDirectoryModalOpen: value
    })),
  setBulkUploadUsers: (value: BulkEmployeeDetails[]) =>
    set((state: DirectoryModalSliceType) => ({
      ...state,
      bulkUploadUsers: value
    })),
  setDirectoryModalType: (value: DirectoryModalTypes) => {
    if (value === DirectoryModalTypes.NONE) {
      set((state: DirectoryModalSliceType) => ({
        ...state,
        isDirectoryModalOpen: false,
        directoryModalType: value
      }));
    } else {
      set((state: DirectoryModalSliceType) => ({
        ...state,
        isDirectoryModalOpen: true,
        directoryModalType: value
      }));
    }
  },
  setSharedCredentialData: (data: QuickAddEmployeeResponse) =>
    set((state: DirectoryModalSliceType) => ({
      ...state,
      sharedCredentialData: data
    }))
});

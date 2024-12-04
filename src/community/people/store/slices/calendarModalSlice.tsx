import {
  type FileUploadType,
  type SetType
} from "~community/common/types/CommonTypes";
import {
  type AddCalenderInputType,
  CalendarSliceTypes
} from "~community/people/types/SliceTypes";

const newCalenderDetails: AddCalenderInputType = {
  acceptedFile: []
};
export const addNewCalenderModalSlice = (
  set: SetType<CalendarSliceTypes>
): CalendarSliceTypes => ({
  newCalenderDetails,
  setNewCalendarDetails: (key: string, value: FileUploadType[] | undefined) =>
    set((state: CalendarSliceTypes) => ({
      ...state,
      newCalenderDetails: { ...state.newCalenderDetails, [key]: value }
    })),
  removeAddedCalendarDetails: () =>
    set((state: CalendarSliceTypes) => ({ ...state, newCalenderDetails }))
});

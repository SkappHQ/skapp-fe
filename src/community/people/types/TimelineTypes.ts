export enum TimelineType {
  JOINED_DATE = "JOINED_DATE"
}

export interface TimelineResponseType {
  results: TimelineDataType[];
}
export interface TimelineDataType {
  year: number;
  month: string;
  employeeTimelineRecords: TimelineRecordType[];
}

export interface TimelineRecordType {
  id: string;
  timelineType: TimelineType;
  title: string;
  previousValue: string;
  newValue: string;
  displayDate: string;
  createdBy: string;
}

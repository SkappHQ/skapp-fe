import { SVGProps } from "react";

export interface IconProps {
  id?: string;
  fill?: string;
  backgroundFill?: string;
  width?: string;
  height?: string;
  transform?: string;
  onClick?: () => void;
  svgProps?: SVGProps<SVGSVGElement>;
}

export enum IconName {
  ATTACHMENT_ICON = "ATTACHMENT_ICON",
  CONFIGURATIONS_ICON = "CONFIGURATIONS_ICON",
  ADD_ICON = "ADD_ICON",
  CLOSE_ICON = "CLOSE_ICON",
  FILE_UPLOAD_ICON = "FILE_UPLOAD_ICON",
  INFORMATION_ICON = "INFORMATION_ICON",
  PLUS_ICON = "PLUS_ICON",
  LEFT_ARROW_ICON = "LEFT_ARROW_ICON",
  RIGHT_ARROW_ICON = "RIGHT_ARROW_ICON",
  BACK_ICON = "BACK_ICON",
  SEARCH_ICON = "SEARCH_ICON",
  REQUEST_CANCEL_CROSS_ICON = "REQUEST_CANCEL_CROSS_ICON",
  EDIT_ICON = "EDIT_ICON",
  DELETE_BUTTON_ICON = "DELETE_BUTTON_ICON",
  CLOSE_STATUS_POPUP_ICON = "CLOSE_STATUS_POPUP_ICON",
  CHECK_WRAPPER_ICON = "CHECK_WRAPPER_ICON",
  DASHBOARD_ICON = "DASHBOARD_ICON",
  PEOPLE_ICON = "PEOPLE_ICON",
  SETTINGS_ICON = "SETTINGS_ICON",
  TIME_SHEET_ICON = "TIME_SHEET_ICON",
  LEAVE_ICON = "LEAVE_ICON",
  EXPAND_ICON = "EXPAND_ICON",
  BELL_ICON = "BELL_ICON",
  MENU_ICON = "MENU_ICON",
  UP_ARROW_ICON = "UP_ARROW_ICON",
  CLOCK_ICON = "CLOCK_ICON",
  DROP_DOWN_ICON = "DROP_DOWN_ICON",
  CHECK_CIRCLE_ICON = "CHECK_CIRCLE_ICON",
  FORWARD_ARROW = "FORWARD_ARROW",
  SELECTED_ICON = "SELECTED_ICON",
  SAVE_ICON = "SAVE_ICON",
  USER_UPLOAD_ICON = "USER_UPLOAD_TYPE",
  PEN_ICON = "PEN_ICON",
  SUPER_ADMIN_ICON = "SUPER_ADMIN_ICON",
  COPY_ICON = "COPY_ICON",
  CHANGE_ICON = "CHANGE_ICON",
  MAGNIFYING_GLASS_ICON = "MAGNIFYING_GLASS_ICON",
  BIN_ICON = "BIN_ICON",
  ROUNDED_CLOSE_ICON = "ROUNDED_CLOSE_ICON",
  TICK_ICON = "TICK_ICON",
  TIMER_ICON = "TIMER_ICON",
  ROTATE_LEFT_ICON = "ROTATE_LEFT_ICON",
  WARNING_ICON = "WARNING_ICON",
  SUCCESS_ICON = "SUCCESS_ICON",
  THREE_DOTS_ICON = "THREE_DOTS_ICON",
  MORE_ICON = "MORE_ICON",
  DANCING_WOMEN_ICON = "DANCING_WOMEN_ICON",
  RESTORE_ICON = "RESTORE_ICON",
  DROPDOWN_ARROW_ICON = "DROPDOWN_ARROW_ICON",
  EMOJI_ICON = "EMOJI_ICON",
  UNCHECKED_ICON = "UNCHECKED_ICON",
  RIGHT_COLORED_ICON = "RIGHT_COLORED_ICON",
  DOWNLOAD_ICON = "DOWNLOAD_ICON",
  CALENDAR_ICON = "CALENDAR_ICON",
  REMOVE_CIRCLE_ICON = "REMOVE_CIRCLE_ICON",
  ASSET_ICON = "ASSET_ICON",
  OBJECTIVES_ICON = "OBJECTIVES_ICON",
  PLAY_ICON = "PLAY_ICON",
  PAUSE_ICON = "PAUSE_ICON",
  UNDO_ICON = "UNDO_ICON",
  CHECK_ICON = "CHECK_ICON",
  DENIED_ICON = "DENIED_ICON",
  DASH_ICON = "DASH_ICON",
  CURVED_TICK_ICON = "CURVED_TICK_ICON",
  RESTRICTIONS_ICON = "RESTRICTIONS_ICON",
  FILTER_ICON = "FILTER_ICON",
  INFO_ICON = "INFO_ICON",
  NO_DATA_ICON = "NO_DATA_ICON",
  APPROVED_STATUS_ICON = "APPROVED_STATUS_ICON",
  CANCELLED_STATUS_ICON = "CANCELLED_STATUS_ICON",
  PENDING_STATUS_ICON = "PENDING_STATUS_ICON",
  DENIED_STATUS_ICON = "DENIED_STATUS_ICON",
  SYNC_ICON = "SYNC_ICON",
  CHEVRON_RIGHT_ICON = "CHEVRON_RIGHT_ICON",
  CHEVRON_LEFT_ICON = "CHEVRON_LEFT_ICON",
  ARROW_FILLED_RIGHT_ICON = "ARROW_FILLED_RIGHT_ICON",
  ARROW_FILLED_LEFT_ICON = "ARROW_FILLED_LEFT_ICON",
  NEW_WINDOW_ICON = "NEW_WINDOW_ICON",
  RIGHT_MARK = "RIGHT_MARK",
  SHARE_ICON = "SHARE_ICON",
  LOCK_ICON = "LOCK_ICON",
  WRENCH_ICON = "WRENCH_ICON",
  PAINT_TRAY_ICON = "PAINT_TRAY_ICON",
  REVOKED_STATUS_ICON = "REVOKED_STATUS_ICON",
  SIGNOUT_ICON = "SIGNOUT_ICON",
  NUDGE_BELL_ICON = "NUDGE_BELL_ICON",
  UPGRADE_INFO_ICON = "UPGRADE_INFO_ICON",
  WARNING_SIGN_ICON = "WARNING_SIGN_ICON",
  GOOGLE_ICON = "GOOGLE_ICON",
  DOCUMENTS_ICON = "DOCUMENTS_ICON",
  PEOPLE_MODULE_ICON = "PEOPLE_MODULE_ICON",
  ATTENDANCE_MODULE_ICON = "ATTENDANCE_MODULE_ICON",
  LEAVE_MODULE_ICON = "LEAVE_MODULE_ICON",
  ESIGNATURE_MODULE_ICON = "ESIGNATURE_MODULE_ICON",
  FILE_ICON = "FILE_ICON",
  DRAG_ICON = "DRAG_ICON",
  SIGN_ICON = "SIGN_ICON",
  VIEW_ICON = "VIEW_ICON",
  GOOGLE_CALENDAR_ICON = "GOOGLE_CALENDAR_ICON",
  SKAPP_ICON = "SKAPP_ICON",
  INITIALS_ICON = "INITIALS_ICON",
  STAMP_ICON = "STAMP_ICON",
  APPROVED_ICON = "APPROVED_ICON",
  DECLINED_ICON = "DECLINED_ICON",
  SIGNATURE_ICON = "SIGNATURE_ICON",
  MASTER_CARD_ICON = "MASTER_CARD_ICON",
  VISA_CARD_ICON = "VISA_CARD_ICON",
  GREY_ROUNDED_TICK_ICON = "GREY_ROUNDED_TICK_ICON",
  GREY_PLUS_ICON = "GREY_PLUS_ICON"
  // add more icons in snake case
}

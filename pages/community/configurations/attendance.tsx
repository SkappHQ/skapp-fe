import { type NextPage } from "next";

import AttendanceConfiguration from "~community/attendance/components/organisms/AttendanceConfiguration/AttendanceConfiguration";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";

const Attendance: NextPage = () => {
  const attendanceConfigurations = useTranslator(
    "attendanceModule",
    "attendanceConfiguration"
  );

  return (
    <>
      <ContentLayout
        pageHead={attendanceConfigurations(["pageHead"])}
        title={attendanceConfigurations(["title"])}
        isDividerVisible={true}
      >
        <AttendanceConfiguration />
      </ContentLayout>
    </>
  );
};

export default Attendance;

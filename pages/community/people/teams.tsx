import { Box } from "@mui/material";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";

import SearchBox from "~community/common/components/molecules/SearchBox/SearchBox";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes } from "~community/common/types/AuthTypes";
import { useGetAllTeams } from "~community/people/api/TeamApi";
import TeamsTable from "~community/people/components/molecules/TeamsTable/TeamsTable";
import TeamModalController from "~community/people/components/organisms/TeamModalController/TeamModalController";
import { usePeopleStore } from "~community/people/store/store";
import { TeamModelTypes } from "~community/people/types/TeamTypes";

const Teams: NextPage = () => {
  const translateText = useTranslator("peopleModule", "teams");
  const [teamSearchTerm, setTeamSearchTerm] = useState<string>("");
  const { setTeamModalType, setIsTeamModalOpen } = usePeopleStore(
    (state) => state
  );

  const { data: session } = useSession();

  const isAdmin = session?.user?.roles?.includes(AdminTypes.PEOPLE_ADMIN);

  const { data: allTeams } = useGetAllTeams();

  return (
    <>
      <ContentLayout
        pageHead={translateText(["tabTitle"])}
        title={translateText(["title"])}
        primaryButtonText={
          isAdmin && (allTeams?.length ?? 0) !== 0 && translateText(["addTeam"])
        }
        onPrimaryButtonClick={() => {
          setIsTeamModalOpen(true);
          setTeamModalType(TeamModelTypes.ADD_TEAM);
        }}
        isDividerVisible
      >
        <Box>
          <SearchBox
            value={teamSearchTerm}
            setSearchTerm={setTeamSearchTerm}
            placeHolder={translateText(["teamSearchPlaceholder"])}
          />
          <TeamsTable
            teamSearchTerm={teamSearchTerm}
            teamAddButtonButtonClick={() => {
              setIsTeamModalOpen(true);
              setTeamModalType(TeamModelTypes.ADD_TEAM);
            }}
            teamAddButtonText={translateText(["addTeam"])}
            isAdmin={isAdmin}
          />
          <TeamModalController />
        </Box>
      </ContentLayout>
    </>
  );
};

export default Teams;

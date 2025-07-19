import { useStatsPageProps } from "../hooks/useStatsPageProps";
import { StatsPagePresentation } from "./StatsPagePresentation";

export const StatsPage = () => {
  const statsPageLogic = useStatsPageProps();

  return <StatsPagePresentation {...statsPageLogic} />;
};

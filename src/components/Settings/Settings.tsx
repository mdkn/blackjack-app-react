import { useSettingsContainer } from "../../hooks/useSettingsContainer";
import { SettingsPresentation } from "./SettingsPresentation";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Settings = (props: SettingsProps) => {
  const settingsLogic = useSettingsContainer();

  return <SettingsPresentation {...props} {...settingsLogic} />;
};

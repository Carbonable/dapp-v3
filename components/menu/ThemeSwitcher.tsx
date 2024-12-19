import { useTheme } from "@/providers/ThemeProvider";
import MenuItem from "./MenuItem";
import { Switch } from "@nextui-org/react";
import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center justify-between w-full">
      <MenuItem title="Theme" icon="theme" />
      <Switch
        defaultSelected={theme === "light"}
        color="primary"
        size="sm"
        onValueChange={toggleTheme}
        thumbIcon={({isSelected, className}) =>
          isSelected ? <SunIcon className={className} /> : <MoonIcon className={className} />
        }
      >
      </Switch>
    </div>
  );
}
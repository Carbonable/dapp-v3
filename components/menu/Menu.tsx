import SectionTitle from "./SectionTitle";
import ThemeSwitcher from "./ThemeSwitcher";
import MenuItem from "./MenuItem";
export default function Menu() {
  return (
    <>
      <div>
        <SectionTitle title="Navigation" />
        <MenuItem title="Portfolio" icon="portfolio" link="/" className="mb-4" />
        <MenuItem title="Staking" icon="staking" isExternal={true} link="https://voyager.online/staking-dashboard" />
      </div>
      <div className="mt-12">
        <SectionTitle title="Settings" />
        <ThemeSwitcher />
      </div>
    </>
  );
}
import SectionTitle from "./SectionTitle";
import ThemeSwitcher from "./ThemeSwitcher";
import MenuItem from "./MenuItem";
import ChainSwitcher from "./ChainSwitcher";
export default function Menu() {
  return (
    <>
      <div>
        <SectionTitle title="Navigation" />
        <MenuItem title="Portfolio" icon="portfolio" link="/" />
        <MenuItem title="Staking" icon="staking" isExternal={true} link="https://voyager.online/staking-dashboard" />
      </div>
      <div className="mt-8 md:mt-12">
        <SectionTitle title="Settings" />
        <ThemeSwitcher />
        <ChainSwitcher />
      </div>
    </>
  );
}
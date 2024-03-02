import { ThemeToggle } from "@restauwants/ui/theme";

import { BottomBar } from "../../components/bottomBar";
import { Navigation } from "../../components/navigation";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      {props.children}
      <BottomBar>
        <div />
        <Navigation />
        <ThemeToggle />
      </BottomBar>
    </>
  );
}

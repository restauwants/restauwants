import { ThemeToggle } from "@restauwants/ui/theme";

import { BottomBar } from "../../components/bottomBar";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      {props.children}
      <BottomBar>
        <div />
        <div />
        <ThemeToggle />
      </BottomBar>
    </>
  );
}

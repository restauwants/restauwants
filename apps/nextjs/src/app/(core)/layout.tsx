// import { ThemeToggle } from "@restauwants/ui/theme";

import { BottomBar } from "../../components/bottom-bar";
import { Navigation } from "../../components/navigation";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      {props.children}
      <BottomBar>
        <div />
        <Navigation />
        <div className="ml-auto mr-4">{/* <ThemeToggle /> */}</div>
      </BottomBar>
    </>
  );
}

import { ThemeToggle } from "@restauwants/ui/theme";

import { BottomBar } from "../../components/bottomBar";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-dvh min-w-full items-center justify-center">
        <div className="bg-signin-background absolute -z-50 h-full w-full max-w-screen-sm bg-cover bg-bottom bg-no-repeat sm:rounded-3xl" />
        <div className="flex w-96 flex-col items-center space-y-2 rounded-3xl border-2 bg-background p-8 text-center shadow-2xl">
          <h1 className="text-5xl font-extrabold">RestauWants</h1>
          {props.children}
        </div>
      </div>
      <BottomBar>
        <div />
        <div />
        <div className="ml-auto mr-4">
          <ThemeToggle />
        </div>
      </BottomBar>
    </>
  );
}

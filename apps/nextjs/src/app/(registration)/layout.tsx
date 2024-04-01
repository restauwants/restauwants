import { ThemeToggle } from "@restauwants/ui/theme";

import { BottomBar } from "../../components/bottomBar";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-dvh min-w-full items-center justify-center">
        <div className="bg-signin-background absolute -z-50 h-full w-full max-w-screen-sm bg-cover bg-bottom bg-no-repeat sm:rounded-3xl" />
        <div className="centered-text-container absolute top-[calc(2/7*100vh)] w-2/3 text-center">
          <p className="text-xl font-bold">
            {" "}
            Uniting food lovers, one plate at a time!
          </p>
        </div>

        <div className="absolute top-[calc(17/24*100vh)] flex h-12 w-48 flex-col items-center justify-center space-y-2 rounded-3xl border-2 bg-background p-8 text-center font-bold shadow-2xl">
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

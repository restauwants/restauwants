import Image from "next/image";

import { ShrimpIcon } from "@restauwants/ui/icons";

// import { ThemeToggle } from "@restauwants/ui/theme";

import { BottomBar } from "../../components/bottomBar";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen min-w-full items-center justify-center">
        <div className="bg-signin-background absolute -z-50 h-full w-screen bg-cover bg-bottom bg-no-repeat" />
        <div className="absolute top-[calc(1/6*100vh)] justify-center">
          <ShrimpIcon className="size-24" />
        </div>

        <div className="flex h-full flex-col items-center justify-center">
          <div className="centered-text-container absolute top-[calc(2/7*100vh)] h-auto w-2/3 text-center">
            <p className="text-xl font-bold">
              Uniting food lovers, one plate at a time!
            </p>
          </div>

          <div className="bottom-[calc(10/14)*100vh)] flex flex-col items-center">
            <div className="mt-36 flex w-2/3 items-center justify-center">
              <Image
                src="/reviews.jpg"
                alt="screenshots"
                width={500}
                height={1500}
              />
            </div>
          </div>

          <div className="absolute top-[calc(13/16*100vh)] flex h-12 w-48 flex-col items-center justify-center space-y-2 rounded-3xl border-2 bg-background p-8 text-center font-bold shadow-2xl">
            {props.children}
          </div>
        </div>
      </div>
      <BottomBar>
        <div />
        <div />
        <div className="ml-auto mr-4">{/* <ThemeToggle /> */}</div>
      </BottomBar>
    </>
  );
}

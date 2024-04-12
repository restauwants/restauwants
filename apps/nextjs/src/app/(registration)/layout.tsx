import { ShrimpIcon } from "@restauwants/ui/icons";

import { BottomBar } from "../../components/bottomBar";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed bottom-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#F16469_100%)]"></div>

      <nav className="fixed left-0 top-0 z-50 w-full bg-secondary shadow-md">
        <div className="mx-auto flex max-w-6xl px-4 py-4 text-center sm:px-12 lg:px-16">
          <h1 className="text-center text-2xl font-bold text-white">
            RestauWants
          </h1>
        </div>
        <div className="hover:white/80 absolute right-4 top-1/2 h-9 -translate-y-1/2 transform rounded-md bg-white px-4 py-2 text-secondary">
          {props.children}
        </div>
      </nav>

      <div className="z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mt-40">
          <div className="-mx-4 flex flex-col md:flex-row">
            <div className="px-4 md:flex-1">
              <div className="mb-4 h-[500px] rounded-lg">
                <img
                  className="h-full w-full object-contain"
                  src="/reviews.png"
                  alt="screenshots"
                />
              </div>
            </div>
            <div className="px-4 md:flex-1">
              <div className="mb-8 mt-8 flex justify-center">
                <ShrimpIcon className="size-24" />
              </div>
              <h2 className="mb-8 flex justify-center text-center text-xl font-bold">
                Uniting food lovers, one plate at a time!
              </h2>
              <p className="text-md mb-8">
                A social food network, providing you reviews from friends you
                trust. Share your passion for food in a closed ecosystem that
                allows for you to share confidently with no concerns for broken
                privacy. We wil always blah blah blah. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit. Sed sed ante justo. Integer
                euismod libero id mauris malesuada tincidunt. Vivamus commodo
                nulla ut lorem rhoncus aliquet.
              </p>
              <div className="mb-8">
                <div className="mt-2 flex items-center justify-center">
                  <div className="w-1/2 space-y-2 rounded-3xl border-2 bg-secondary p-8 text-center font-bold text-white shadow-2xl">
                    {props.children}
                  </div>
                </div>
              </div>
            </div>
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

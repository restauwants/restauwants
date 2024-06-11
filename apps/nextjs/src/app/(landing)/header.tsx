import Link from "next/link";

import { Button } from "@restauwants/ui/button";

import { landingPage } from "../paths";

export const Header = () => {
  // TODO(99): add behavior to button
  return (
    <div className="container relative flex max-w-[76rem] flex-row justify-between py-4">
      <Link href={landingPage} className="flex flex-row items-center">
        <span className="font-brand text-lg">RestauWants</span>
      </Link>
      <div className="flex flex-row items-center gap-4">
        <Button className="h-10" variant="ghost">
          Sign in
        </Button>
        <Button className="h-10" variant="outline">
          Get started
        </Button>
      </div>
      <div className="absolute inset-x-0 top-full mt-px h-px bg-muted" />
    </div>
  );
};

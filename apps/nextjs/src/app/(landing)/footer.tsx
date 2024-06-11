import Link from "next/link";

import { GitHubIcon } from "@restauwants/ui/icons";

export const Footer = () => {
  // TODO(99): move github href to constants module
  const githubHref = "https://github.com/restauwants/restauwants";

  return (
    <div className="container relative mt-24 flex max-w-[76rem] flex-row justify-between pb-20 pt-5">
      <div className="absolute inset-x-0 bottom-full mb-px h-px bg-muted" />
      <p className="text-sm text-muted-foreground">RestauWants</p>
      <Link href={githubHref} rel="noopener noreferrer" target="_blank">
        <GitHubIcon className="fill-muted-foreground" />
      </Link>
    </div>
  );
};

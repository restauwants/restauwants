"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@restauwants/ui";
import {
  CircleFadingPlusIcon,
  HomeIcon,
  UserIcon,
} from "@restauwants/ui/icons";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@restauwants/ui/navigation-menu";

import {
  feedPage as feedPagePath,
  profilePage as profilePagePath,
  reviewPage as reviewPagePath,
} from "~/app/paths";

export const Navigation = () => {
  const pathname = usePathname();

  const iconStyleForPagePath = useCallback(
    (pagePath: string) => {
      const isCurrentPage = pathname === pagePath;
      return {
        strokeWidth: isCurrentPage ? 3 : 2,
        className: cn("size-7", isCurrentPage && "text-primary"),
      };
    },
    [pathname],
  );

  return (
    <NavigationMenu className="rounded-2xl border bg-background px-2 py-1">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={feedPagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <HomeIcon {...iconStyleForPagePath(feedPagePath)} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={reviewPagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <CircleFadingPlusIcon {...iconStyleForPagePath(reviewPagePath)} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={profilePagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <UserIcon {...iconStyleForPagePath(profilePagePath)} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

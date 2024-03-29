"use client";

import Link from "next/link";

import {
  HomeIcon,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  PersonIcon,
  PlusCircledIcon,
} from "@restauwants/ui/navigation-menu";

import {
  feedPage as feedPagePath,
  profilePage as profilePagePath,
  reviewPage as reviewPagePath,
} from "~/app/paths";

export function Navigation() {
  return (
    <NavigationMenu className="rounded-2xl border bg-background px-2 py-1">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={feedPagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <HomeIcon className="size-5" />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={reviewPagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <PlusCircledIcon className="size-5" />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={profilePagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <PersonIcon className="size-5" />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

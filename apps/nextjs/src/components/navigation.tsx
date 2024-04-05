"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const [isHomePage, setIsHomePage] = useState(false);
  const [isReviewPage, setIsReviewPage] = useState(false);
  const [isProfilePage, setIsProfilePage] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsHomePage(pathname === "/feed");
    setIsReviewPage(pathname === "/review");
    setIsProfilePage(pathname === "/profile");
  }, [pathname]);

  return (
    <NavigationMenu className="rounded-2xl border bg-background px-2 py-1">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={feedPagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <HomeIcon
                className={`size-5 ${isHomePage ? "text-secondary" : ""}`}
              />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={reviewPagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <PlusCircledIcon
                className={`size-5 ${isReviewPage ? "text-secondary" : ""}`}
              />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={profilePagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <PersonIcon
                className={`size-5 ${isProfilePage ? "text-secondary" : ""}`}
              />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

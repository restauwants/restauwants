"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleFadingPlus, Home, User } from "lucide-react";

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
              <Home
                strokeWidth={`${isHomePage ? 3 : 2}`}
                className={`size-7 ${isHomePage ? "text-secondary" : ""}`}
              />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={reviewPagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <CircleFadingPlus
                strokeWidth={`${isReviewPage ? 3 : 2}`}
                className={`size-7 ${isReviewPage ? "text-secondary" : ""}`}
              />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={profilePagePath} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <User
                strokeWidth={`${isProfilePage ? 3 : 2}`}
                className={`size-7 ${isProfilePage ? "text-secondary" : ""}`}
              />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

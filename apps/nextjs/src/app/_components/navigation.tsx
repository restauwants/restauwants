"use client";

import Link from "next/link";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
    HomeIcon,
    PlusCircledIcon,
    PersonIcon,
  } from "@restauwants/ui/navigation-menu";

export function Navigation() {
    return (
        <div className="fixed w-full bottom-4 flex justify-center">
            <NavigationMenu className="px-2 py-1 bg-background rounded-2xl">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/feed" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                <HomeIcon />
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/review" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                <PlusCircledIcon />
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/profile" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                <PersonIcon />
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

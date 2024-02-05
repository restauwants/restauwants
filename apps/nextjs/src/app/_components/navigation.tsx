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
            <NavigationMenu className="p-2 bg-background rounded-full">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/feed" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                <HomeIcon />
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/addreview" legacyBehavior passHref>
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

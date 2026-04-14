"use client";

import Link from "next/link";
import React, {useState} from "react";
import {MenuIcon} from "lucide-react";
import {Poppins} from "next/font/google";
import Image from "next/image";
import {usePathname} from "next/navigation";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

import {NavbarSidebar} from "./navbar-sidebar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

interface NavbarProps {
    slug: string;
}

interface NavbarItemProps {
    href: string,
    children: React.ReactNode,
    isActive?: boolean,
}

const NavbarItem = ({
                        href,
                        children,
                        isActive,
                    }: NavbarItemProps) => {
    return (

        <Button
            asChild
            variant="outline"
            className={cn(
                "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
                isActive && "bg-black text-white hover:bg-black hover:text-white",
            )}
        >
            <Link href={href}>
                {children}
            </Link>
        </Button>
    );
};


export const Navbar = ({slug}: NavbarProps) => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }));

    const navbarItems = [
        {href: "", children: "Home"},
        {href: "/attractions", children: "Nearby Attractions"},
        {href: "/contact", children: "Contact"},
    ];

    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <header className="h-16 border-b font-medium justity-between bg-white
            max-w-full sm:max-w-[calc(100vw-2rem)] lg:max-w-6xl
            sm:border-x
            mx-auto">
            <div className="max-w-(--breakpoint-xl) mx-auto flex items-center h-full gap-2 px-4 py-6 lg:px-12" >
                <Link href="/" className="flex items-center">
                    {data.icon?.url && (
                        <Image
                            alt={"tenantSlug"}
                            src={data.icon.url}
                            width={64}
                            height={64}
                            className="shrink-0 size-16"
                        />
                    )}
                    <span className={cn("text-5xl font-semibold", poppins.className)}>
                      {slug}
                    </span>
                </Link>

                <NavbarSidebar
                    items={navbarItems}
                    open={isSidebarOpen}
                    onOpenChange={setIsSidebarOpen}
                />

                <nav className="items-center gap-4 hidden md:flex flex-auto ">
                    {navbarItems.map((item, index) => (
                        <NavbarItem
                            key={index}
                            href={'/tenants/' + slug + item.href}
                            isActive={pathname === '/tenants/' + slug + item.href}
                        >
                            {item.children}
                        </NavbarItem>
                    ))}
                </nav>

                <div className="flex-auto justify-end flex md:hidden items-center ">
                    <Button
                        variant="ghost"
                        className="size-12 border-transparent bg-white"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <MenuIcon/>
                    </Button>
                </div>

            </div>
        </header>
    )
}

export const NavbarSkeleton = () => {
    return (
        <nav className="h-20 border-b font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
                <div/>
                <Button disabled className="bg-white">
                    {/*<ShoppingCartIcon className="text-black" />*/}
                </Button>
            </div>
        </nav>
    );
};
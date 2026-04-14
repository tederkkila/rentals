import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {Navbar, NavbarSkeleton} from "@/modules/tenants/ui/components/navbar";
import {Footer} from "@/modules/tenants/ui/components/footer";


interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
    const { slug } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({
        slug,
    }));

    return (
        <div className="min-h-screen bg-[#F4F4F0] relative w-full">

            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<NavbarSkeleton />}>
                    <Navbar slug={slug}/>
                </Suspense>
            </HydrationBoundary>

            <div className="sm:border-x
                max-w-full sm:max-w-[calc(100vw-2rem)] lg:max-w-6xl
                mx-auto">
                <div className="">
                    {children}
                </div>
            </div>

            <Footer />

        </div>
    );
};

export default Layout;
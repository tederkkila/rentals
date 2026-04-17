import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { UnitListView } from "@/modules/units/ui/views/unit-list-view";
import { TenantRichText } from "@/modules/tenants/ui/components/tenant-rich-text"
import { loadUnitFilters } from "@/modules/units/search-params";
import { ErrorBoundary } from "react-error-boundary";
import React, { Suspense } from "react";
import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/components/navbar";


interface Props {
    searchParams: Promise<SearchParams>;
    params: Promise<{ slug: string }>;
}

const Page = async ({ params, searchParams }: Props) => {
    const { slug } = await params;
    const filters = await loadUnitFilters(searchParams);

    prefetch(
        trpc.tenants.getOne.queryOptions({
            slug: slug,
        })
    );

    prefetch(
        trpc.units.getMany.queryOptions({
            ...filters,
            tenantSlug: slug,
            limit: DEFAULT_LIMIT,
        }),
    );

    return (
        <div className="flex flex-col gap-4">

            <HydrateClient>
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <Suspense fallback={<NavbarSkeleton />}>
                        <TenantRichText slug={slug} />
                        <UnitListView tenantSlug={slug} />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>

        </div>
    );
}

export default Page;

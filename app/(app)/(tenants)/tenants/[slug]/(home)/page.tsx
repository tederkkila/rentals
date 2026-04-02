import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { DEFAULT_LIMIT } from "@/constants";
import { getQueryClient, trpc } from "@/trpc/server";

import { UnitListView } from "@/modules/units/ui/views/unit-list-view";
import { loadUnitFilters } from "@/modules/units/search-params";

interface Props {
    searchParams: Promise<SearchParams>;
    params: Promise<{ slug: string }>;
}

const Page = async ({ params, searchParams }: Props) => {
    const { slug } = await params;
    const filters = await loadUnitFilters(searchParams);

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.units.getMany.queryOptions({
        ...filters,
        tenantSlug: slug,
        limit: DEFAULT_LIMIT,
    }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <UnitListView tenantSlug={slug} narrowView />
        </HydrationBoundary>
    );
}

export default Page;

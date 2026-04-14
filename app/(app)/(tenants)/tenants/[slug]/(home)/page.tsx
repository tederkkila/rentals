import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { DEFAULT_LIMIT } from "@/constants";
import { getQueryClient, trpc } from "@/trpc/server";

import { UnitListView } from "@/modules/units/ui/views/unit-list-view";
import { TenantRichText } from "@/modules/tenants/ui/components/tenant-rich-text"
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

    const queryClientTenant = getQueryClient();
    void queryClientTenant.prefetchQuery(trpc.tenant.getOne.queryOptions({
        slug: slug,
    }));



    return (
        <div className="wrapper--ticks p-4 md:p-10 flex flex-col gap-4">

            <HydrationBoundary state={dehydrate(queryClientTenant)}>
                <TenantRichText slug={slug} />
            </HydrationBoundary>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <UnitListView tenantSlug={slug} narrowView />
            </HydrationBoundary>

        </div>
    );
}

export default Page;

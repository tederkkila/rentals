import { Suspense } from "react"

import { UnitSort } from "../components/unit-sort"
import { UnitFilters } from "../components/unit-filters"
import { UnitList, UnitListSkeleton } from "../components/unit-list"

interface Props {
    category?: string;
    tenantSlug?: string;
}

export const UnitListView = ({ category, tenantSlug, narrowView }: Props) => {
    return (
        <div className="px-4 lg:px-8 py-4 flex flex-col gap-4">

            <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
                <p className="text-2xl font-medium">Curated for you</p>
                <UnitSort />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
                <div className="lg:col-span-2 xl:col-span-2">
                    <UnitFilters />
                </div>
                <div className="lg:col-span-4 xl:col-span-6">
                    <Suspense fallback={<UnitListSkeleton />}>
                        <UnitList category={category} tenantSlug={tenantSlug} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};
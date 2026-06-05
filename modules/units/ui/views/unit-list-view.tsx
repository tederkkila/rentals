import React, { Suspense } from "react"

import { UnitSort } from "../components/unit-sort"
import { UnitFilters } from "../components/unit-filters"
import { UnitList, UnitListSkeleton } from "../components/unit-list"
import { Skeleton, Text, AspectRatio } from "@radix-ui/themes";

interface Props {
    category?: string;
    tenantSlug?: string | undefined;
}

export const UnitListView = ({ category, tenantSlug }: Props) => {
    return (
        <div className="px-4 lg:px-8 py-4 flex flex-col gap-4">

            <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
                <p className="text-2xl font-medium">Curated for you</p>
                <UnitSort />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-8">
                <div className="lg:col-span-2 xl:col-span-2">
                    <UnitFilters tenantSlug={tenantSlug} />
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
//<UnitListSkeleton />
export const UnitListViewSkeleton = () => {
    return (
        <div className="px-4 lg:px-8 py-4 flex flex-col gap-4">

            <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
                <Skeleton>
                    <Text size="8" weight="bold" className="mb-2">
                        Lorem ipsum dolor
                    </Text>
                </Skeleton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-8">
                <div className="lg:col-span-2 xl:col-span-2">
                    <Skeleton>
                        <AspectRatio ratio={1}>
                            <div className="w-full h-full" />
                        </AspectRatio>
                    </Skeleton>
                </div>
                <div className="lg:col-span-4 xl:col-span-6">
                    <UnitListSkeleton />
                </div>
            </div>
        </div>
    )
};
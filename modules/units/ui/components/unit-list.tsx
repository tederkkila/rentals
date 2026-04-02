"use client";

import { InboxIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import { UnitCard, UnitCardSkeleton } from "./unit-card";
import { useUnitFilters } from "../../hooks/use-unit-filters";

interface Props {
    category?: string;
    tenantSlug?: string;
    narrowView?: boolean;
}

export const UnitList = ({ tenantSlug, narrowView }: Props) => {
    const [filters] = useUnitFilters();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.units.getMany.queryOptions(
        {
            ...filters,
            tenantSlug,
            limit: DEFAULT_LIMIT,
        }
    ));

    if (data.docs?.length === 0) {
        return (
            <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                <InboxIcon />
                <p className="text-base font-medium">No units found</p>
            </div>
        )
    }


    return (
        <>
            <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
                narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
            )}>
                {data?.docs.map((unit) => (
                    <UnitCard
                        key={unit.id}
                        id={unit.id}
                        name={unit.name}
                        imageUrl={unit.image?.url}
                        tenantSlug={unit.tenant?.slug}
                        tenantIconUrl={unit.tenant?.icon?.url}
                        price={unit.price}
                    />
                ))}
            </div>
        </>
    );
};

export const UnitListSkeleton = ({ narrowView }: Props) => {
    return (
        <div className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
            narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
        )}>
            {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                <UnitCardSkeleton key={index} />
            ))}
        </div>
    );
};
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
}

export const UnitList = ({ tenantSlug }: Props) => {
    const [filters] = useUnitFilters();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.units.getMany.queryOptions(
        {
            ...filters,
            tenantSlug: tenantSlug,
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
                "grid grid-cols-1 gap-4"
            )}>
                {data?.docs.map((unit) => (
                    <UnitCard key={unit.id} unit={unit} />
                ))}
            </div>
        </>
    );
};

export const UnitListSkeleton = () => {
    return (
        <div className={"grid grid-cols-1 gap-4"}>
            {Array.from({ length: 3 }).map((_, index) => (
                <UnitCardSkeleton key={index} />
            ))}
        </div>
    );
};
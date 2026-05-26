import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { cn, generateTenantURL } from "@/lib/utils";
import type { Unit, Tenant, Media } from "@/payload-types";

import { AmenitiesList } from "@/modules/units/ui/components/amenities-list"

import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: [ "latin" ],
    weight: [ "700" ],
});

interface UnitCardProps {
    unit: Unit,
    key?: React.Key,
}

export const UnitCard = ({ unit }: UnitCardProps) => {
    const router = useRouter();

    const tenant: Tenant = unit.tenant as Tenant;
    if (!unit.tenant || typeof unit.tenant === "string") {
        return;
    }

    const tenantIcon: Media= tenant.icon as Media;
    if (!tenant.icon || typeof tenant.icon === "string") {
        return;
    }

    const unitImage: Media = unit.image as Media;
    if (!unit.image || typeof unit.image === "string") {
        return;
    }

    const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        router.push(generateTenantURL(tenant.slug));
    };

    return (
        <Link href={`/units/${unit.slug}`}>
            <div className="
            hover:shadow-[1px_1px_0px_0px_rgba(30,30,30,0.5)]
            transition-shadow border rounded-md bg-white
            overflow-hidden h-full
            flex flex-col md:flex-row ">

                {unit.image?.url && (
                    <div className="relative aspect-square">
                        <Image
                            loading="eager"
                            alt={unit.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            src={unit.image?.url || "/placeholder.png"}
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="p-4 gap-3 flex-1 border-y md:border-none">
                    <h2 className={cn("text-xl font-bold leading-none", poppins.className)}>{unit.name}</h2>
                    <h3 className="font-light mb-2 text-gray-600 md:line-clamp-1">{unit.quickDescription}</h3>

                    <div className="flex text-md text-bold text-gray-600">

                        <div className="columns-1 flex-auto">
                            <span className="text-nowrap flex">{unit.guests} Guest(s)</span>
                            <span className="text-nowrap flex">{unit.bathrooms} Bathroom(s)</span>
                            {unit.size &&
                                <span className="text-nowrap flex">{unit.size} sq. ft.</span>
                            }
                        </div>

                        <div className="flex-1 columns-2 ">
                            <div className="flex">
                                <AmenitiesList unit={unit}/>
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center gap-2" onClick={handleUserClick}>
                        {tenant.icon?.url && (
                            <Image
                                alt={tenant.slug}
                                src={tenant.icon?.url}
                                width={16}
                                height={16}
                                sizes="(max-width: 1920px) 10vw"
                                className="rounded-full border shrink-0 size-4"
                            />
                        )}
                        <p className="text-sm underline font-medium">{tenant.slug}</p>
                    </div>

                </div>
                {/*<div className="p-4">*/}
                {/*    <div className="w-fit">*/}
                {/*        <p className="text-sm font-medium text-right">*/}
                {/*            <span>Peak: {formatCurrency(unit.peakRate)}/week</span><br/>*/}
                {/*            <span>{formatCurrency(unit.offRate)}/week</span>*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </Link>
    )
};

interface UnitCardSkeletonProps {
    key?: React.Key,
}

export const UnitCardSkeleton = ({}: UnitCardSkeletonProps) => {
    return (
        <div className="w-full aspect-4/1 bg-neutral-200 rounded-lg animate-pulse"/>
    );
};
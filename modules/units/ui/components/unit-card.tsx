import React from "react";
import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {cn, formatCurrency, generateTenantURL} from "@/lib/utils";
import {Units} from "@/collections/Units";

import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

import { IconSpan }  from "@/modules/ui/icon-span"
import { AmenitiesList } from "@/modules/units/ui/components/amenities-list"


interface UnitCardProps {
    unit: Units;
}

export const UnitCard = ({
        unit,
    }: UnitCardProps) => {
    const router = useRouter();

    const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        router.push(generateTenantURL(unit.tenant?.slug));
    };

    return (
    <Link href={`${generateTenantURL(unit.tenant?.slug)}/units/${unit.id}`}>
        <div className="
            hover:shadow-[1px_1px_0px_0px_rgba(30,30,30,0.5)]
            transition-shadow border rounded-md bg-white
            overflow-hidden h-full
            flex flex-col md:flex-row ">
            <div className="relative aspect-square">
                <Image
                    alt={unit.name}
                    fill
                    src={unit.image?.url || "/placeholder.png"}
                    className="object-cover"
                />
            </div>
            <div className="p-4 gap-3 flex-1 border-y md:border-none">
                <h2 className={cn("text-xl font-bold leading-none", poppins.className)}>{unit.name}</h2>
                <h3 className="font-light mb-2 text-gray-600 md:line-clamp-1">{unit.description}</h3>

                <div className="flex text-md text-bold text-gray-600">

                    <div className="columns-1 flex-auto">
                        <span className="text-nowrap flex">Guest(s): {unit.guests}</span>
                        <span className="text-nowrap flex">Bathroom(s): {unit.bathrooms}</span>
                        <IconSpan name={'FaWifi'} label={'Test'} size={15} />
                    </div>

                    <div className="flex-1 columns-2 ">
                        <div className="flex">
                            <AmenitiesList unit={unit} />
                        </div>
                    </div>

                </div>

                <div className="flex items-center gap-2" onClick={handleUserClick}>
                    {unit.tenant?.icon?.url && (
                        <Image
                            alt={unit.tenant?.slug}
                            src={unit.tenant?.icon?.url}
                            width={16}
                            height={16}
                            className="rounded-full border shrink-0 size-4"
                        />
                    )}
                    <p className="text-sm underline font-medium">{unit.tenant?.slug}</p>
                </div>
                {/*{reviewCount > 0 && (*/}
                {/*    <div className="flex items-center gap-1">*/}
                    {/*        <StarIcon className="size-3.5 fill-black" />*/}
                    {/*        <p className="text-sm font-medium">*/}
                    {/*            {reviewRating} ({reviewCount})*/}
                    {/*        </p>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
                <div className="p-4">
                    <div className="w-fit">
                        <p className="text-sm font-medium text-right">
                            <span>Peak: {formatCurrency(unit.peakRate)}/week</span><br/>
                            <span>{formatCurrency(unit.offRate)}/week</span>
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
};

export const UnitCardSkeleton = () => {
    return (
        <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
    );
};
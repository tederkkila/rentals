"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Unit, Tag, Tenant, Reservation, Rate, Peakseason, Discount, Media } from "@/payload-types"
import { Section, Box, Heading, Flex } from "@radix-ui/themes";
import { RichText } from "@payloadcms/richtext-lexical/react";
import React, { Suspense } from "react";
import { IconSpan } from "@/modules/ui/icon-span";
import { UnitImageGrid } from '@/modules/units/ui/components/UnitImageGrid'
import { ReservationPicker } from '@/modules/units/ui/components/ReservationPicker'
import {ImageSlider} from "@/modules/ui/ImageSlider";
import {DotImageSlider} from "@/modules/ui/DotImageSlider";

const isTag = (tag: string | Tag): tag is Tag => {
    return typeof tag === "object" && tag !== null;
};

const isMedia = (media: string | Media): media is Media => {
    return typeof media === "object" && media !== null;
};

interface UnitViewProps {
    unit: string;
}

type UnitWithCalendar = Unit & {
    tenant: Tenant | null;
    reservations: Reservation[];
    rates: Rate[];
    peakseasons: Peakseason[];
    discounts: Discount[];
};

export const UnitView = ({ unit }: UnitViewProps) => {

    const trpc = useTRPC();

    const {data} = useSuspenseQuery(trpc.units.getUnitWithCalendar.queryOptions({ slug: unit }));
    const unitData: UnitWithCalendar = data;

    //console.log("unit:" + JSON.stringify(unitData.contentImages));

    let amenities: Tag[] = [];
    if (unitData.tags) {
        amenities = unitData.tags
            .filter(isTag)
            .filter((tag) => tag.isAmenity === true);
    }


    // console.log("amenities:" + JSON.stringify(unitData.tags));

    let contentImages: Media[] = [];
    if (unitData.contentImages) {
        contentImages = unitData.contentImages
            .filter(isMedia);
    }


    return (
        <Box className="p-8">
            <Heading className="pb-4" as="h1" size={{ initial: '6', sm: '8' } as const}>{unitData.name}</Heading>

            <UnitImageGrid unit={unitData} />

            <Flex direction={{ initial: "column", sm: "row" } as const}>
                <Box className="flex-6">
                    <Box className="prose lg:prose-lg max-w-none prose-stone">
                        {unitData.content && (
                            <RichText data={unitData.content}/>
                        )}
                    </Box>

                    {contentImages &&
                        <Box className="flex flex-col items-center">

                            <DotImageSlider images={ contentImages } aspectRatio={4/3} />
                        </Box>
                    }

                </Box>
                <Box className="flex-4">
                    <Box ml={{ initial: "0", sm: "5" }} mt="25px" mb="25px">
                        <Suspense fallback={"loading calendar..."}>
                            <ReservationPicker unit={unitData} />
                        </Suspense>
                    </Box>

                    <Box ml={{ initial: "0", sm: "5" }} mt={{ initial: "0", sm: "25px" }}>
                        <Heading as="h2" size="5" mb={"4"}>Amenities</Heading>
                        {amenities && (
                            <div className="flex flex-wrap gap-2">
                                {amenities.map((tag: Tag) => (
                                    <div key={tag.id} className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                                        <IconSpan name={tag.icon} label={tag.name} size={15}  />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Box>
                </Box>
            </Flex>




        </Box>
    )
};

export const UnitViewSkeleton = () => {
    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="border rounded-sm bg-white overflow-hidden">
                <div className="relative aspect-[3.9] border-b">
                    {/*<Image*/}
                    {/*    src={"/placeholder.png"}*/}
                    {/*    alt="Placeholder"*/}
                    {/*    fill*/}
                    {/*    className="object-cover"*/}
                    {/*/>*/}
                </div>
            </div>
        </div>
    )
}
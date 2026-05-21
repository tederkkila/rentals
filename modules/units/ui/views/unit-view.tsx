"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Unit, Tag, Tenant, Reservation, Rate, Peakseason, Discount } from "@/payload-types"
import { Section, Box, Heading, Flex } from "@radix-ui/themes";
import { RichText } from "@payloadcms/richtext-lexical/react";
import React, { Suspense } from "react";
import { IconSpan } from "@/modules/ui/icon-span";
import { UnitImageGrid } from '@/modules/units/ui/components/UnitImageGrid'
import { ReservationPicker } from '@/modules/units/ui/components/ReservationPicker'

interface UnitViewProps {
    unit: string;
}

export const UnitView = ({ unit }: UnitViewProps) => {

    const trpc = useTRPC();

    const {data} = useSuspenseQuery(trpc.units.getUnitWithCalendar.queryOptions({ slug: unit }));
    const unitData = data as Unit & {
        tenant: Tenant | null,
        reservations: Reservation[] | null,
        rates: Rate[] | null,
        peakseasons: Peakseason[] | null,
        discount: Discount[] | null,
    }

    //console.log("unit:" + JSON.stringify(unitData));
    const amenities = unitData.tags.filter( (tag) => tag.isAmenity === true);

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
                </Box>
                <Box className="flex-4">
                    <Box ml={{ initial: "0", sm: "5" }} mt="25px">
                        <Suspense fallback={"loading calendar..."}>
                            <ReservationPicker unit={unitData} />
                        </Suspense>
                    </Box>
                </Box>
            </Flex>


            <Section size="1" >
                <Heading as="h2" size="4">Amenities</Heading>
                {amenities && (
                    <div className="flex flex-wrap gap-2">
                        {amenities.map((tag: Tag) => (
                            <div key={tag.id} className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                                <IconSpan name={tag.icon} label={tag.name} size={15}  />
                            </div>
                        ))}
                    </div>
                )}
            </Section>

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
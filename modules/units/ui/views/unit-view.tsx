"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Unit, Tag, Media } from "@/payload-types"
import { Section, Box, Heading, Flex } from "@radix-ui/themes";
import { RichText } from "@payloadcms/richtext-lexical/react";
import React from "react";
import { IconSpan } from "@/modules/ui/icon-span";
import { UnitImageGrid } from '@/modules/units/ui/components/UnitImageGrid'
import { ReservationPicker } from '@/modules/units/ui/components/ReservationPicker'

interface UnitViewProps {
    unit: string;
}

export const UnitView = ({ unit }: UnitViewProps) => {

    const trpc = useTRPC();

    const {data}: Unit = useSuspenseQuery(trpc.units.getOne.queryOptions({ slug: unit }));

    //console.log("unit:" + JSON.stringify(data));

    return (
        <Box className="p-8">
            <Heading className="pb-4" as="h1" size={{ initial: '6', sm: '8' }}>{data.name}</Heading>

            <UnitImageGrid unit={data} />

            <Flex direction={{ initial: "column", sm: "row" }}>
                <Box className="flex-6">
                    <Box className="prose lg:prose-lg max-w-none prose-stone">
                        {data.content && (
                            <RichText data={data.content}/>
                        )}
                    </Box>
                </Box>
                <Box className="flex-4">
                    <Box ml={{ initial: "0", sm: "5" }} mt="25px">
                        <ReservationPicker unit={data} />
                    </Box>
                </Box>
            </Flex>


            <Section size="1" >
                <Heading as="h2" size="4">Amenities</Heading>
                {data.tags && (
                    <div className="flex flex-wrap gap-2">
                        //TODO Only display tags with isAmenity = true
                        {data.tags.map((tag: Tag, index: number) => (
                            <div key={tag.id} className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                                <IconSpan name={tag.icon} label={tag.name} size={15} index={index} />
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
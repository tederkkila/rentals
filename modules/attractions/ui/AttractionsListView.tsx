"use client";

import { useTRPC } from "@/trpc/client";
import { Tenant, Attraction } from "@/payload-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box, Heading, Section, Avatar, Flex, Text } from "@radix-ui/themes";
import { UnitImageGrid } from "@/modules/units/ui/components/UnitImageGrid";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { IconSpan } from "@/modules/ui/icon-span";
import React from "react";
import { Card } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
    tenantSlug: string;
}

export const AttractionsListView = ({ tenantSlug }: Props) => {

    const trpc = useTRPC();

    const { data }: Tenant = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug: tenantSlug }));

    //console.log("AttractionsListView tenant:" + JSON.stringify(data));

    return (
        <Box className="">

            <Section size="1" >
                {data.attractions && (

                    <div className="flex flex-wrap gap-2">
                        {data.attractions.map((attraction: Attraction) => (

                            <Box key={attraction.id} className="min-w-full" >
                                <Link href={(attraction.url) ? attraction.url : ''} target="_blank">
                                <Card>
                                    <Flex gap="3" align="center">
                                        <Avatar
                                            size="8"
                                            src={attraction.image?.url}
                                            radius="medium"
                                            fallback="O"
                                        />
                                        <Box>
                                            <Text as="div" size="3" weight="bold">
                                                {attraction.name}
                                            </Text>
                                            <Text as="div" size="2" color="gray">
                                                {attraction.url}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Card>
                                </Link>
                            </Box>

                        ))}
                    </div>

                )}
            </Section>

        </Box>
    )
};
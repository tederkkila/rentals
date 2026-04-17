"use client";

import { useTRPC } from "@/trpc/client";
import { Tenant } from "@/payload-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box, Heading, Section, Avatar, Flex, Text } from "@radix-ui/themes";
import { RichText } from "@payloadcms/richtext-lexical/react";
import React from "react";

interface Props {
    tenantSlug: string;
}

export const ContactInfoView = ({ tenantSlug }: Props) => {

    const trpc = useTRPC();

    const { data }: Tenant = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug: tenantSlug }));


    return (
        <Box className="">

            <Box className="prose lg:prose-lg max-w-none prose-stone">
                {data.contact && (
                    <RichText data={data.contact}/>
                )}
            </Box>

        </Box>

    )


}

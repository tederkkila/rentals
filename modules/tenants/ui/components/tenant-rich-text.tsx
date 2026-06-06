'use client'

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from "@/trpc/client";
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from "next/image";
import React from "react";
import { AspectRatio, Box, Grid, Flex, Container, Text, Skeleton } from "@radix-ui/themes";

interface TenantProps {
    slug: string;
}

export const TenantRichText = ({slug}: TenantProps) => {

    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.tenants.getOne.queryOptions({slug}));

    return (
        <article className="border-b">
            <Grid columns={{initial: '1', sm: '2'}} gapX='0' gapY={"4"}>

                <div className="p-4 pb-0 sm:pb-4 md:p-8
                    md:border-r
                    md:col-span-1">
                    <Box className="prose lg:prose-lg max-w-none prose-stone">
                        {data.content && (
                            <RichText data={data.content}/>
                        )}
                    </Box>
                </div>

                <div className="p-4 pt-0 md:p-8
                        md:col-span-1">
                    {data.image?.url && (
                        <AspectRatio ratio={1}>
                            <Image
                                loading="eager"
                                alt={data.image?.alt}
                                src={data.image?.url}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                                className="flex-1 border"
                                style={{
                                    objectFit: "cover",
                                    borderRadius: "var(--radius-2)",
                                }}
                            />
                        </AspectRatio>
                    )}
                </div>

            </Grid>
        </article>

    )
}

export const TenantRichTextSkeleton = () => {
    return (
        <article className="border-b">
            <Grid columns={{initial: '1', sm: '2'}} gapX='0' gapY={"4"}>

                <div className="p-4 pb-0 sm:pb-4 md:p-8
                    md:border-r
                    md:col-span-1">
                    {/*<Container size="1">*/}
                        <Flex direction="column" gap="3">
                            <Skeleton>
                                <Text size="8" weight="bold" className="mb-2">
                                    Lorem ipsum dolor
                                </Text>
                            </Skeleton>

                            <Text>
                                <Skeleton>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                                    felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                                    erat, fringilla sed commodo sed, aliquet nec magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                                    felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                                    erat, fringilla sed commodo sed, aliquet nec magna.
                                </Skeleton>
                            </Text>

                            <Text>
                                <Skeleton>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                                    felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                                    erat, fringilla sed commodo sed, aliquet nec magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                                    felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
                                    erat, fringilla sed commodo sed, aliquet nec magna.
                                </Skeleton>
                            </Text>

                        </Flex>
                    {/*</Container>*/}
                </div>

                <div className="p-4 pt-0 md:p-8
                        md:col-span-1">
                    <Skeleton>
                        <AspectRatio ratio={1}>
                        <div className="w-full h-full" />
                        </AspectRatio>
                    </Skeleton>
                </div>

            </Grid>
        </article>
    )
}
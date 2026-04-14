'use client'

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from "@/trpc/client";
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from "next/image";
import React from "react";
import { AspectRatio, Box, Grid } from "@radix-ui/themes/dist/esm";
import DecorativeBox from "@/modules/ui/DecorativeBox";
import { Theme } from "@radix-ui/themes";

interface TenantProps {
    slug?: string;
}

export const TenantRichText = ({slug}: TenantProps) => {

    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.tenants.getOne.queryOptions({slug}));

    // console.log("richText:" + data.content);

    return (
        <article className="">
            <Grid columns={{initial: '1', sm: '6', md: '8', lg: '8', xl: '8'}} gapX={{initial: '0', sm: '8'}}
                  gapY={"4"}>

                <div className="sm:col-span-1 md:col-span-2 lg:col-span-3">
                    {data.image?.url && (
                        <AspectRatio ratio={1 / 1}>
                            <Image
                                alt={data.image?.alt}
                                src={data.image?.url}
                                fill
                                className="flex-1 border"
                                style={{
                                    objectFit: "cover",
                                    borderRadius: "var(--radius-2)",
                                }}
                            />
                        </AspectRatio>
                    )}
                </div>

                <div className="sm:col-span-2 md:col-span-4 lg:col-span-5">
                    <Box className="prose">
                        {data.content && (
                            <RichText data={data.content}/>
                        )}
                    </Box>
                </div>

            </Grid>
        </article>


        // <article className="md:flex gap-4">
        //         {data.image?.url && (
        //             <Image
        //                 alt={data.image?.alt}
        //                 src={data.image?.url}
        //                 width={100}
        //                 height={100}
        //                 className="flex-1 border "
        //             />
        //         )}
        //
        //         <div className="flex-1 prose-sm md:prose lg:prose-lg xl:prose-xl">
        //             {data.content && (
        //                 <RichText data={data.content} />
        //             )}
        //         </div>
        //     </article>

    )
}
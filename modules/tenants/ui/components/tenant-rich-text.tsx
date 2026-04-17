'use client'

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from "@/trpc/client";
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from "next/image";
import React from "react";
import { AspectRatio, Box, Grid } from "@radix-ui/themes";
import DecorativeBox from "@/modules/ui/DecorativeBox";
import { Theme } from "@radix-ui/themes";

interface TenantProps {
    slug: string;
}

export const TenantRichText = ({slug}: TenantProps) => {

    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.tenants.getOne.queryOptions({slug}));

    // console.log("richText:" + data.content);

    return (
        <article className="border-b">
            <Grid columns={{initial: '1', sm: '2'}} gapX='0'
                  gapY={"4"}>

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
                        <AspectRatio ratio={1 / 1}>
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
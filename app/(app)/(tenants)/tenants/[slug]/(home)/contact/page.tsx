import { Heading } from "@radix-ui/themes";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Box } from "@radix-ui/themes";
import { ErrorBoundary } from "react-error-boundary";
import React, { Suspense } from "react";
import { ContactInfoView } from "@/modules/ui/ContactInfoView";


interface Props {
    params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
    const { slug } = await params;

    prefetch(
        trpc.tenants.getOne.queryOptions({
            slug: slug,
        })
    );

    return (
        <div className="flex flex-col gap-4">

            <Box className="p-8">

                <Heading className="pb-4" as="h1" size={{ initial: '6', sm: '8' }}>Contact Information</Heading>

                <HydrateClient>
                    <ErrorBoundary fallback={<div>Something went wrong</div>}>
                        <Suspense>
                            <ContactInfoView tenantSlug={slug} />
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>

            </Box>

        </div>
    );
}

export default Page;
import { ErrorBoundary } from "react-error-boundary";
import React, { Suspense } from "react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Section, Box, Heading } from "@radix-ui/themes";
import { AttractionsListView} from "@/modules/attractions/ui/AttractionsListView";

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

                <Heading className="pb-4" as="h1" size={{ initial: '6', sm: '8' }}>Local Attractions</Heading>

                <HydrateClient>
                    <ErrorBoundary fallback={<div>Something went wrong</div>}>
                        <Suspense>
                            <AttractionsListView tenantSlug={slug} />
                        </Suspense>
                    </ErrorBoundary>
                </HydrateClient>

            </Box>

        </div>
    );
}

export default Page;
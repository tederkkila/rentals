import React, { Suspense } from "react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";

import { UnitView, UnitViewSkeleton } from "@/modules/units/ui/views/unit-view";

interface Props {
    params: Promise<{
        slug: string;
        unit: string;
    }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: Props) => {
    const { slug, unit } = await params;

    console.log(`[unit]page.tsx | unit: ${unit}`);

    prefetch(
        trpc.units.getOne.queryOptions({ slug: unit }),
    );

    return (
        <div className="flex flex-col gap-4">

            <HydrateClient>
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                        <UnitView unit={ unit } />
                </ErrorBoundary>
            </HydrateClient>

        </div>
    );
}

export default Page;
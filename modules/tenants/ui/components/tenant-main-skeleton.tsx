import React from "react";
import { TenantRichTextSkeleton } from "@/modules/tenants/ui/components/tenant-rich-text"
import { UnitListViewSkeleton } from "@/modules/units/ui/views/unit-list-view";
//import { AspectRatio, Skeleton } from "@radix-ui/themes";

export default function TenantMainSkeleton() {
    return (
        <div>
            {/*<div className="border border-gray-200 p-4 rounded shadow animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>*/}
            <TenantRichTextSkeleton />

            {/*<Skeleton>*/}
            {/*    <AspectRatio ratio={1}>*/}
            {/*        <div className="w-full h-full" />*/}
            {/*    </AspectRatio>*/}
            {/*</Skeleton>*/}

            <UnitListViewSkeleton />

        </div>
    );
}


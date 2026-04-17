import { createTRPCRouter } from '../init';
import { tenantsRouter } from '@/modules/tenants/server/procedures';
import { unitsRouter } from "@/modules/units/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";
import { attractionsRouter } from "@/modules/attractions/server/procedures";

export const appRouter = createTRPCRouter({
    tags: tagsRouter,
    tenants: tenantsRouter,
    units: unitsRouter,
    attractions: attractionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
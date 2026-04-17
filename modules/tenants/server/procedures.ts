import z from "zod";
import { TRPCError } from "@trpc/server";
import { Media, Tenant } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const tenantsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                slug: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {

            //console.log("tenantsRouter getOne | slug: "  + input.slug)

            const tenantsData = await ctx.db.find({
                collection: "tenants",
                depth: 2, // "tenant.image" is a type of "Media"
                where: {
                    slug: {
                        equals: input.slug,
                    },
                },
                limit: 1,
                pagination: false,
            });

            const tenant = tenantsData.docs[0];
            //console.log(tenant)

            if (!tenant) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
            }

            return tenant as Tenant & { icon: Media | null, image: Media | null };
        }),
});
import z from "zod";
import { TRPCError } from "@trpc/server";
import { Media, Tenant } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { DEFAULT_LIMIT } from "@/constants";


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
    getInfiniteUnitTags: baseProcedure
        .input(
            z.object({
                slug: z.string(),
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_LIMIT)
            })
        )
        .query(async ({ ctx, input }) => {

            // 1. Fetch all units for this tenant
            const result  = await ctx.db.find({
                collection: 'units',
                where: {
                    'tenant.slug': {
                        equals: input.slug,
                    },
                },
                page: 1, //set to one to trick paging
                limit: 100, //set to 100 to ensure we get all units in a tenant
                select: { tags: true },
            });

            // Flatten and deduplicate tags for this specific batch
            let pageTags = [...new Set(result.docs.flatMap((u) => u.tags || []))];
            //remove tags that are not searchable
            pageTags = [...pageTags].filter(tag => tag.isSearchable === true);
            //sort tags by order from payload
            pageTags.sort((a, b) => a._order.localeCompare(b._order));
            const totalPages = Math.ceil(pageTags.length / input.limit);

            //only return input.limit number of tags extra per page
            const returnMin = (input.limit * (input.cursor - 1));
            const returnMax = (input.limit * input.cursor);
            const returnLimit = returnMax >= pageTags.length ? pageTags.length : returnMax;
            const currentPageTags = [...pageTags].slice(returnMin, returnLimit).map(item => item as Tag);

            // console.log(returnMin)
            // console.log(returnMax)
            // console.log(pageTags.length)
            // console.log(returnLimit)
            // console.log(input.limit)
            // console.log(input.cursor)
            // console.log(totalPages)

            return {
                docs: currentPageTags,
                totalDocs: pageTags.length,
                limit: input.limit,
                totalPages: totalPages,
                page: input.cursor,
                pagingCounter: input.limit * (input.cursor - 1) + 1,
                hasPrevPage: input.cursor !== 1,
                hasNextPage: input.cursor !== totalPages,
                prevPage: input.cursor > 1 ? input.cursor - 1 : null,
                nextPage: input.cursor < totalPages ? input.cursor + 1 : null,
            };
        }),
});
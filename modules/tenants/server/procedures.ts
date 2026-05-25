import z from "zod";
import { TRPCError } from "@trpc/server";
import { Attraction, Media, Tenant, Tag } from "@/payload-types";

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

            return tenant as Tenant & {
                icon: Media | null;
                image: Media | null;
                favicon: Media | null;
                attractions: Attraction[] | null;
            };
        }),
    getInfiniteUnitTags: baseProcedure
        .input(
            z.object({
                slug: z.string(),
                cursor: z.number().int().min(1).default(1),
                limit: z.number().int().min(1).max(200).default(DEFAULT_LIMIT)
            })
        )
        .query(async ({ ctx, input }) => {

            // 1. Fetch all units for this tenant
            const result  = await ctx.db.find({
                collection: 'units',
                depth: 2,
                where: {
                    'tenant.slug': {
                        equals: input.slug,
                    },
                },
                page: 1, //set to one to trick paging
                limit: 100, //set to 100 to ensure we get all units in a tenant
                select: { tags: true },
            });

            const isTag = (tag: unknown): tag is Tag => {
                //confirm that the tag results are tags and not strings
                return typeof tag === "object" && tag !== null && "id" in tag;
            };

            //put all the tags into a single array
            let pageTags = [
                ...new Map(
                    result.docs
                        .flatMap((unit) => unit.tags ?? [])
                        .filter(isTag)
                        .map((tag) => [tag.id, tag]),
                ).values(),
            ];

            //filter out tags that are not searchable
            pageTags = pageTags.filter((tag) => tag.isSearchable === true);

            //sort the tags by their order (from payload tag listing)
            pageTags.sort((a, b) => {
                return String(a._order ?? "").localeCompare(String(b._order ?? ""));
            });

            const totalPages = Math.ceil(pageTags.length / input.limit);

            //only return input.limit number of tags extra per page
            const returnMin = (input.limit * (input.cursor - 1));
            const returnMax = (input.limit * input.cursor);
            const returnLimit = returnMax >= pageTags.length ? pageTags.length : returnMax;
            const currentPageTags = pageTags.slice(returnMin, returnLimit);

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
                hasNextPage: input.cursor < totalPages,
                prevPage: input.cursor > 1 ? input.cursor - 1 : null,
                nextPage: input.cursor < totalPages ? input.cursor + 1 : null,
            };
        }),
});
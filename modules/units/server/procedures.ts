import z from "zod";
import { TRPCError } from "@trpc/server";
import type { Sort, Where } from "payload";

import { DEFAULT_LIMIT } from "@/constants";
import { Media, Unit } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { sortValues } from "../search-params";

export const unitsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                slug: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {

            //console.log("unitsRouter getOne | slug: "  + input.slug)

            const unitsData = await ctx.db.find({
                collection: "units",
                depth: 1,
                where: {
                    slug: {
                        equals: input.slug,
                    },
                },
                limit: 1,
                pagination: false,
            });

            const unit = unitsData.docs[0];
             console.log("unit.name: " + unit.name)

            if (!unit) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Unit not found" });
            }

            return unit as Unit & { coverImage: Media | null, image: Media | null };
        }),
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_LIMIT),
                search: z.string().nullable().optional(),
                category: z.string().nullable().optional(),
                minPrice: z.string().nullable().optional(),
                maxPrice: z.string().nullable().optional(),
                tags: z.array(z.string()).nullable().optional(),
                sort: z.enum(sortValues).nullable().optional(),
                tenantSlug: z.string().nullable().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {

            //console.log("unitsRouter getMany | tenantSlug: "  + input.tenantSlug)

            let where: Where = {};

            if (input.tags && input.tags.length > 0) {
                //console.log(input.tags)
                let andArray = [];
                for (const tag of input.tags) {
                    // console.log(tag)
                    andArray.push({"tags.slug": {equals: tag}})
                }

                where = {
                    and: andArray,
                };
            }

            // console.log(JSON.stringify(where, null, 2))

            where.isArchived = {
                not_equals: true,
            };

            let sort: Sort = "_order";

            if (input.sort === "curated") {
                sort = "_order";
            }

            if (input.sort === "hot_and_new") {
                sort = "+createdAt";
            }

            if (input.sort === "trending") {
                sort = "-createdAt";
            }

            if (input.minPrice && input.maxPrice) {
                where.price = {
                    greater_than_equal: input.minPrice,
                    less_than_equal: input.maxPrice,
                }
            } else if (input.minPrice) {
                where.price = {
                    greater_than_equal: input.minPrice
                }
            } else if (input.maxPrice) {
                where.price = {
                    less_than_equal: input.maxPrice
                }
            }

            if (input.tenantSlug) {
                where["tenant.slug"] = {
                    equals: input.tenantSlug,
                };
            } else {
                // If we are loading products for public storefront (no tenantSlug),
                // Make sure to not load products set to "isPrivate: true" (using reverse not_equals logic)
                // These products are exclusively private to the tenant store

                where["isPrivate"] = {
                    not_equals: true,
                }
            }

            if (input.search) {
                where["name"] = {
                    like: input.search,
                };
            }

            const data = await ctx.db.find({
                collection: "units",
                depth: 2, // Populate "category", "image", "tenant" & "tenant.image"
                where,
                sort,
                page: input.cursor,
                limit: input.limit,
            });

            //console.log(data)

            const dataWithPrices = await Promise.all(
                data.docs.map(async (doc) => {
                    const peakPriceData = await ctx.db.find({
                        collection: "rates",
                        depth: 0,
                        pagination: false,
                        where: {
                            year: {equals: 2026},
                            unit: {equals: doc.id},
                            peak: {equals: true},
                        }
                    });

                    const offPriceData = await ctx.db.find({
                        collection: "rates",
                        depth: 0,
                        pagination: false,
                        where: {
                            year: {equals: 2026},
                            unit: {equals: doc.id},
                            peak: {not_equals: true},
                        }
                    });

                    // console.log(peakPriceData.docs)

                    return {
                        ...doc,
                        peakRate: peakPriceData.docs[0]?.price,
                        offRate: offPriceData.docs[0]?.price,

                    }
                })
            )

            return {

                ...data,
                docs: dataWithPrices.map((doc) => ({
                     ...doc,
                //     image: doc.image as Media | null,
                //     tenant: doc.tenant as Tenant & { image: Media | null },
                }))
            }
        }),
});
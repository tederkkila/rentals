import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const attractionsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z.number().default(1),
                limit: z.number().default(DEFAULT_LIMIT),
            }),
        )
        .query(async ({ ctx, input }) => {

            const data = await ctx.db.find({
                collection: "attractions",
                page: input.cursor,
                limit: input.limit,
                sort: "_order",
            });

            return data
        }),
});
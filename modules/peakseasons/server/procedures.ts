import z from "zod";
import { TRPCError } from "@trpc/server";
import { Peakseason } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { DEFAULT_LIMIT } from "@/constants";

export const peakseasonsRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(
            z.object({
                slug: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {})
})
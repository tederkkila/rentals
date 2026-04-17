import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type UnitsGetManyOutput = inferRouterOutputs<AppRouter>["units"]["getMany"];
export type UnitsGetOneOutput = inferRouterOutputs<AppRouter>["units"]["getOne"];

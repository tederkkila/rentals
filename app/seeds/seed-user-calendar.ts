import { getPayload } from "payload";
import config from "@payload-config";

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const queryClient = getQueryClient();
const gray = await queryClient.fetchQuery(trpc.unit.getOne.queryOptions({ slug: gray }));

const reservations = [
    {
        user: "tederkkila+gray@gmail.com",
        unit: "gray",
        startDate: "2026-07-01",
        endDate: "2024-07-08",
    }
]
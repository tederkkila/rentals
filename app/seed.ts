import { getPayload } from "payload";
import config from "@payload-config";

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const locations = [
    {
        name: "Greensboro",
        slug: "greensboro",
        units : [
            {
                name: "Greensboro Gray",
                slug: "gray",
            },
            {
                name: "Greensboro Green",
                slug: "green",
            },
            {
                name: "Greensboro Red",
                slug: "red",
            },
            {
                name: "Greensboro Boathouse",
                slug: "boathouse",
            },
        ]
    },
    {
        name: "Maui",
        slug: "maui",
        units : [
            {
                name: "Maui North",
                slug: "north",
            },
            {
                name: "Maui South",
                slug: "south",
            },
        ]
    }
]

const seed = async () => {
    const payload = await getPayload({ config });
    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

    // Create admin user
    await payload.create({
        collection: "users",
        data: {
            email: "admin@demo.com",
            password: "demo",
            roles: ["super-admin"],
            username: "admin",
        },
    });

    for (const location of locations) {

        const tenant = await payload.create({
            collection: "tenants",
            data: {
                name: location.name,
                slug: location.slug,
            },
        });
        console.log(`Created tenant: ${tenant.slug}`);

        for (const unit of location.units) {

            await console.log(`Created unit: ${unit.slug} for tenant: ${tenant.id}`);

            await Promise.all([
                await payload.create({
                    collection: 'units',
                    data: {
                        tenant: tenant.id,
                        name: unit.name,
                        slug: unit.slug,
                    },
                }),
            ])

            await wait(500)

        }

    }
}

try {
    await seed();
    console.log('Seeding completed successfully');
    process.exit(0);
} catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1); // Exit with error code
}
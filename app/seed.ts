import { getPayload } from "payload";
import config from "@payload-config";

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const properties = [
    {
        name: "All",
        slug: "all",
    },
    {
        name: "Greensboro Property Gray",
        slug: "gray",
    },
    {
        name: "Greensboro Property Green",
        slug: "green",
    },
    {
        name: "Greensboro Property Red",
        slug: "red",
    },
    {
        name: "Greensboro Property Boathouse",
        slug: "boathouse",
    },
    {
        name: "Maui Property North",
        slug: "north",
    },
    {
        name: "Maui Property South",
        slug: "south",
    }
]

const seed = async () => {
    const payload = await getPayload({ config });

    //const adminAccount = await stripe.accounts.create({});

    // Create admin tenant
    const adminTenant = await payload.create({
        collection: "tenants",
        data: {
            name: "admin",
            slug: "admin",
            //stripeAccountId: adminAccount.id,
        },
    });

    // Create admin user
    await payload.create({
        collection: "users",
        data: {
            email: "admin@demo.com",
            password: "demo",
            roles: ["super-admin"],
            username: "admin",
            tenants: [
                {
                    tenant: adminTenant.id,
                },
            ],
        },
    });

    for (const property of properties) {
        await payload.create({
            collection: "properties",
            data: {
                name: property.name,
                slug: property.slug,
            },
        });

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
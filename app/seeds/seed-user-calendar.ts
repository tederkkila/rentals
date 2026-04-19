import { getPayload } from "payload";
import config from "@payload-config";

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const payload = await getPayload({config});
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

const findUnit = async (slug: string) => {
    const unit = await payload.find(
        {
            collection: "units",
            depth: 0,
            where: {
                slug: {
                    equals: slug,
                },
            },
        },
    )
}

const gray = await findUnit("four-season-house");
const green = await findUnit("lakeside-cottage");
const red = await findUnit("red-cabin");

const customers = [
    {
        email: "tederkkila+gray@gmail.com",
        firstName: "Ted",
        lastName: "Gray",
        phone: "1234567890",
        address: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "USA",
    },
    {
        email: "tederkkila+red@gmail.com",
        firstName: "Ted",
        lastName: "Red",
        phone: "1234567890",
        address: "321 Main St",
        city: "Anytown",
        state: "VT",
        zip: "54321",
        country: "USA",
    }
]

const reservations = [
    {
        user: "tederkkila+gray@gmail.com",
        unit: gray, //this is variable to find a unit with the stub "four-season-house"
        startDate: "2026-07-01",
        endDate: "2024-07-08",
        status: "confirmed", // "confirmed", "pending", "cancelled"
        notes: "This is a test reservation",
        quote: 1000,
        amountPaid: 1000,
        depositPaid: 250,
        cleaningDate: "2024-07-08 11:00:00",
        cleaningNotes: "This is a test cleaning note. ex Cleaning not required.",
    },
    {
        user: "tederkkila+red@gmail.com",
        unit: red, //this is variable to find unit with stub "red-cabin"
        startDate: "2026-07-21",
        endDate: "2024-07-28",
        status: "pending", // "confirmed", "pending", "cancelled"
        notes: "This is a test reservation",
        quote: 800,
        amountPaid: 800,
        depositPaid: 200,
        cleaningDate: "2024-07-28 08:00:00",
        cleaningNotes: "This is a test cleaning note. ex Cleaning not required.",
    }
]

const seed = async () => {


    await wait(1000)

}



try {
    await seed();
    console.log('Seeding completed successfully');
    process.exit(0);
} catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1); // Exit with error code
}
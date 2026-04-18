import { getPayload } from "payload";
import config from "@payload-config";
import path from "path";
import fs from "fs";

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const locations = [
    {
        name: "Caspian",
        slug: "caspian",
        icon: {
            alt: "caspian",
            filename: "forest.png",
            mimetype: "image/png",
        },
        description: "Caspian Lake has long been a favorite retreat for academics and artists. Hidden away in Vermont's Northeast Kingdom, the lake and its surroundings are nestled in a postcard setting of quiet pastures, green mountains and covered bridges. The famously crystal clear waters of the lake itself offer opportunity for sailing, swimming or just a quiet, care-free day out on the dock. Nature lovers will really enjoy the lush surroundings, endlessly starry nights, and the occasional wild visitor (loons, black bear, mergansers, mink, and the occasional moose have all been seen on the property).",
        units : [
            {
                name: "The Four Season House",
                slug: "gray",
                description: "Enjoy Caspian Lake year round",
                bathrooms: 2,
                guests: 6,
                image: {
                    alt: "Four Season House",
                    filename: "gray_map.jpg",
                    mimetype: "image/jpeg",
                },
                rates: [
                    {year: 2025, peak: true, price: 1800},
                    {year: 2025, peak: false, price: 1100},
                    {year: 2026, peak: true, price: 2200},
                    {year: 2026, peak: false, price: 1500},
                    {year: 2027, peak: true, price: 2500},
                    {year: 2027, peak: false, price: 1800},
                ],
                tags: [
                    //special tags
                    { name: "Winterized", slug: "winterized", icon: "LuSunSnow", isSearchable: true, isAmenity: true},
                    { name: "Lake View", slug: "lake-view", icon: "MdOutlineWaterDrop", isSearchable: true, isAmenity: false},
                    { name: "Modern", slug: "modern", icon: "HiHomeModern", isSearchable: true, isAmenity: true},
                    { name: "Laundry", slug: "outdoor-dining", icon: "MdOutlineLocalLaundryService", isSearchable: true, isAmenity: true},
                    { name: "Dishwasher", slug: "dishwasher", icon: "BiSolidWasher", isSearchable: true, isAmenity: true},

                    //general tags
                    { name: "Sauna Access", slug: "sauna-access", icon: "PiTowel", isSearchable: true, isAmenity: true},
                    { name: "Beach", slug: "beach", icon: "FaUmbrellaBeach", isSearchable: true, isAmenity: true},
                    { name: "Private Beach", slug: "private-beach", icon: "PiSunglassesFill", isSearchable: true, isAmenity: true},
                    { name: "Crystal Clear Water", slug: "crystal-clear", icon: "RiDiamondLine", isSearchable: true, isAmenity: false},
                    { name: "Books", slug: "books", icon: "ImBooks", isSearchable: false, isAmenity: true},
                    { name: "Kitchen", slug: "kitchen", icon: "FaKitchenSet", isSearchable: true, isAmenity: true},
                    { name: "Outdoor Grill", slug: "outdoor-grill", icon: "MdOutdoorGrill", isSearchable: true, isAmenity: true},
                    { name: "Wifi", slug: "wifi", icon: "FaWifi", isSearchable: true, isAmenity: true},
                    { name: "Outdoor Dining", slug: "outdoor-dining", icon: "MdDeck", isSearchable: false, isAmenity: true},
                    { name: "Fireplace", slug: "fireplace", icon: "MdFireplace", isSearchable: true, isAmenity: true},
                    { name: "Water Gear", slug: "water-gear", icon: "TbScubaMask", isSearchable: true, isAmenity: true},


                ],
            },
            {
                name: "The Lakeside Cottage",
                slug: "green",
                description: "Caspian Lake on your doorstep",
                bathrooms: 1,
                guests: 5,
                image: {
                    alt: "The Lakeside Cottage",
                    filename: "green_map.jpg",
                    mimetype: "image/jpeg",
                },
                rates: [
                    {year: 2025, peak: true, price: 1800},
                    {year: 2025, peak: false, price: 900},
                    {year: 2026, peak: true, price: 2200},
                    {year: 2026, peak: false, price: 1100},
                    {year: 2027, peak: true, price: 2500},
                    {year: 2027, peak: false, price: 1250},
                ],
                tags: [
                    { name: "Lake View", slug: "lake-view", icon: "MdOutlineWaterDrop", isSearchable: true, isAmenity: false},
                    { name: "Lakeside", slug: "lakeside", icon: "GiBoatFishing", isSearchable: true, isAmenity: false},
                    { name: "Rustic", slug: "rustic", icon: "MdCabin", isSearchable: true, isAmenity: true},

                    { name: "Sauna Access", slug: "sauna-access", icon: "PiTowel", isSearchable: true, isAmenity: true},
                    { name: "Beach", slug: "beach", icon: "FaUmbrellaBeach", isSearchable: true, isAmenity: true},
                    { name: "Private Beach", slug: "private-beach", icon: "PiSunglassesFill", isSearchable: true, isAmenity: true},
                    { name: "Crystal Clear Water", slug: "crystal-clear", icon: "RiDiamondLine", isSearchable: true, isAmenity: false},
                    { name: "Kitchen", slug: "kitchen", icon: "FaKitchenSet", isSearchable: true, isAmenity: true},
                    { name: "Outdoor Grill", slug: "outdoor-grill", icon: "MdOutdoorGrill", isSearchable: true, isAmenity: true},
                    { name: "Wifi", slug: "wifi", icon: "FaWifi", isSearchable: true, isAmenity: true},
                    { name: "Outdoor Dining", slug: "outdoor-dining", icon: "MdDeck", isSearchable: false, isAmenity: true},
                    { name: "Fireplace", slug: "fireplace", icon: "MdFireplace", isSearchable: true, isAmenity: true},
                    { name: "Water Gear", slug: "water-gear", icon: "TbScubaMask", isSearchable: true, isAmenity: true},
                ],
            },
            {
                name: "The Red Cabin",
                slug: "red",
                description: "This unit will only show to tenantAdmin and superAdmin is it is 'private'",
                bathrooms: 1,
                guests: 4,
                image: {
                    alt: "The Red Cabin",
                    filename: "red_map.jpg",
                    mimetype: "image/jpeg",
                },
                rates: [
                    {year: 2025, peak: true, price: 900},
                    {year: 2025, peak: false, price: 450},
                    {year: 2026, peak: true, price: 1100},
                    {year: 2026, peak: false, price: 550},
                    {year: 2027, peak: true, price: 1300},
                    {year: 2027, peak: false, price: 650},
                ],
                tags: [
                    { name: "Rustic", slug: "rustic", icon: "MdCabin", isSearchable: true, isAmenity: true},

                    { name: "Sauna Access", slug: "sauna-access", icon: "PiTowel", isSearchable: true, isAmenity: true},
                    { name: "Beach", slug: "beach", icon: "FaUmbrellaBeach", isSearchable: true, isAmenity: true},
                    { name: "Private Beach", slug: "private-beach", icon: "PiSunglassesFill", isSearchable: true, isAmenity: true},
                    { name: "Crystal Clear Water", slug: "crystal-clear", icon: "RiDiamondLine", isSearchable: true, isAmenity: false},
                    { name: "Kitchen", slug: "kitchen", icon: "FaKitchenSet", isSearchable: true, isAmenity: true},
                    { name: "Outdoor Grill", slug: "outdoor-grill", icon: "MdOutdoorGrill", isSearchable: true, isAmenity: true},
                    { name: "Wifi", slug: "wifi", icon: "FaWifi", isSearchable: true, isAmenity: true},
                    { name: "Outdoor Dining", slug: "outdoor-dining", icon: "MdDeck", isSearchable: false, isAmenity: true},
                    { name: "Fireplace", slug: "fireplace", icon: "MdFireplace", isSearchable: true, isAmenity: true},
                    { name: "Water Gear", slug: "water-gear", icon: "TbScubaMask", isSearchable: true, isAmenity: true},
                ],
                isPrivate: true,
            },
            {
                name: "The Boathouse",
                slug: "boathouse",
                image: {
                    alt: "The Boathouse",
                    filename: "forest.png",
                    mimetype: "image/png",
                },
                bathrooms: 0,
                guests: 2,
                tags: [
                    { name: "Lake View", slug: "lake-view", icon: "MdOutlineWaterDrop", isSearchable: true, isAmenity: false},
                    { name: "Lakeside", slug: "lakeside", icon: "GiBoatFishing", isSearchable: true, isAmenity: false},
                    { name: "Rustic", slug: "rustic", icon: "MdCabin", isSearchable: true, isAmenity: true},

                    { name: "Sauna Access", slug: "sauna-access", icon: "PiTowel", isSearchable: true, isAmenity: true},
                    { name: "Beach", slug: "beach", icon: "FaUmbrellaBeach", isSearchable: true, isAmenity: true},
                    { name: "Private Beach", slug: "private-beach", icon: "PiSunglassesFill", isSearchable: true, isAmenity: true},
                    { name: "Crystal Clear Water", slug: "crystal-clear", icon: "RiDiamondLine", isSearchable: true, isAmenity: false},
                    { name: "Water Gear", slug: "water-gear", icon: "TbScubaMask", isSearchable: true, isAmenity: true},

                ],
                isPrivate: true,
                isArchived: true,
            },
        ],
        attractions : [
            {
                name: "Bread & Puppet Theater",
                slug: "bread-puppet-theater",
                url: "https://www.breadandpuppet.com",
                image: {
                    alt: "Bread & Puppet Theater",
                    filename: "forest.png",
                    mimetype: "image/png",
                },
                favorite: true,
            },
            {
                name: "Hill FarmStead Brewery",
                slug: "hill-farmstead-brewery",
                url: "https://www.hill.farmstead.org",
                image: {
                    alt: "Hill FarmStead Brewery",
                    filename: "forest.png",
                    mimetype: "image/png",
                },
                favorite: true,
            },
            {
                name: "Buffalo Mountain Coop",
                slug: "buffalo-mountain-coop",
                url: "https://www.buffalomountaincoop.com/",
                image: {
                    alt: "Buffalo Mountain Coop",
                    filename: "forest.png",
                    mimetype: "image/png",
                },
                favorite: false,
            }
        ]
    },


    {
        name: "Maui",
        slug: "maui",
        description: "This the Maui Location Description",
        icon: {
            alt: "maui",
            filename: "dragonfly.png",
            mimetype: "image/png",
        },
        units : [
            {
                name: "Maui North",
                slug: "north",
                image: {
                    alt: "Maui North",
                    filename: "dragonfly.png",
                    mimetype: "image/png",
                },
                bathrooms: 1,
                guests: 4,
                isPrivate: false,
                isArchived: false,
                rates: [
                    {year: 2025, peak: true, price: 1800},
                    {year: 2025, peak: false, price: 900},
                    {year: 2026, peak: true, price: 2200},
                    {year: 2026, peak: false, price: 1100},
                    {year: 2027, peak: true, price: 2500},
                    {year: 2027, peak: false, price: 1250},
                ],
                tags: [
                    { name: "Lānai", slug: "lanai", icon: "MdDeck", isSearchable: true, isAmenity: true},
                    { name: "Beach", slug: "beach", icon: "FaUmbrellaBeach", isSearchable: true, isAmenity: true},
                    { name: "Kitchen", slug: "kitchen", icon: "FaKitchenSet", isSearchable: true, isAmenity: true},
                    { name: "Wifi", slug: "wifi", icon: "FaWifi", isSearchable: true, isAmenity: true},
                    { name: "Water Gear", slug: "water-gear", icon: "TbScubaMask", isSearchable: true, isAmenity: true},

                ],
            },
            {
                name: "Maui South",
                slug: "south",
                image: {
                    alt: "Maui South",
                    filename: "dragonfly.png",
                    mimetype: "image/png",
                },
                bathrooms: 2,
                guests: 4,
                isPrivate: false,
                isArchived: false,
                rates: [
                    {year: 2025, peak: true, price: 1800},
                    {year: 2025, peak: false, price: 900},
                    {year: 2026, peak: true, price: 2200},
                    {year: 2026, peak: false, price: 1100},
                    {year: 2027, peak: true, price: 2500},
                    {year: 2027, peak: false, price: 1250},
                ],
                tags: [
                    { name: "Lānai", slug: "lanai", icon: "MdDeck", isSearchable: true, isAmenity: true},
                    { name: "Pool", slug: "pool", icon: "FaSwimmingPool", isSearchable: true, isAmenity: true},
                    { name: "Beach", slug: "beach", icon: "FaUmbrellaBeach", isSearchable: true, isAmenity: true},
                    { name: "Kitchen", slug: "kitchen", icon: "FaKitchenSet", isSearchable: true, isAmenity: true},
                    { name: "Wifi", slug: "wifi", icon: "FaWifi", isSearchable: true, isAmenity: true},
                    { name: "Water Gear", slug: "water-gear", icon: "TbScubaMask", isSearchable: true, isAmenity: true},

                ],
            },
        ],
        attractions : [
            {
                name: "Beach Street Maui Shave Ice",
                slug: "beach-street-maui-shave-ice",
                url: "https://beachstreetmaui.com/menu/",
                image: {
                    alt: "Beach Street Maui Shave Ice",
                    filename: "forest.png",
                    mimetype: "image/png",
                },
                favorite: true,
            }
            ],
    }
]

const seed = async () => {
    const payload = await getPayload({ config });
    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

    await wait(1000)
    // Create admin user
    await payload.create({
        collection: "users",
        data: {
            email: "tederkkila@gmail.com",
            password: process.env.TEDMIN,
            roles: ["super-admin"],
            username: "admin",
        }
    });

    console.log("Created admin user");

    await wait(500)

    for (const location of locations) {

        const iconPath = path.resolve(__dirname, "seedMedia", location.icon.filename);

        const tenantIcon = await payload.create({
            collection: "media",
            data: {
                alt: location.icon.alt,
            },
            file: {
                data: fs.readFileSync(iconPath),
                name: location.icon.filename,
                mimetype: location.icon.mimetype,
            },
        })

        await wait(100)

        const tenant = await payload.create({
            collection: "tenants",
            data: {
                name: location.name,
                slug: location.slug,
                icon: tenantIcon.id,
            },
        });

        await wait(100)
        console.log(`Created tenant: ${tenant.slug}`);

        for (const unit of location.units) {

            console.log(`Creating unit: ${unit.slug} for tenant: ${tenant.id}`);

            const unitImagePath = path.resolve(__dirname, "seedMedia", unit.image.filename);
            const unitImage = await payload.create({
                collection: "media",
                data: {
                    alt: unit.image.alt,
                },
                file: {
                    data: fs.readFileSync(unitImagePath),
                    name: unit.image.filename,
                    mimetype: unit.image.mimetype,
                },
            })

            await wait(500)

            const currentUnit = await payload.create({
                collection: 'units',
                data: {
                    tenant: tenant.id,
                    name: unit.name,
                    slug: unit.slug,
                    bathrooms: unit.bathrooms,
                    guests: unit.guests,
                    isPrivate: unit.isPrivate,
                    isArchived: unit.isArchived,
                    image: unitImage.id,
                },
            })

            await wait(500)

            if (unit.rates && unit.rates.length > 0) {
                for (const rate of unit.rates) {
                    await payload.create({
                        collection: "rates",
                        data: {
                            unit: currentUnit.id,
                            year: rate.year,
                            peak: rate.peak,
                            price: rate.price,
                        }
                    })
                }
            }

            console.log(`Created rates for unit ${unit.name}`);
            await wait(500)

            if (unit.tags && unit.tags.length > 0) {
                for (const tag of unit.tags) {

                    //get properties of the unit
                    const updateUnit = await payload.findByID({
                        collection: 'units',
                        id: currentUnit.id,
                        depth: 0, // Keep depth 0 to get only IDs
                    });

                    // console.log(updateUnit)
                    // console.log(updateUnit.tags)

                    //check if the tag already exists
                    const existingDocs = await payload.find({
                        collection: 'tags',
                        where: {
                            slug: {
                                equals: tag.slug,
                            },
                        },
                        limit: 1, // Optimize: only need to know if at least one exists
                    });

                    if (existingDocs.docs.length === 0) {
                        //create the tag if it doesn't exist'
                        const newTag = await payload.create({
                            collection: 'tags',
                            data: {
                                name: tag.name,
                                slug: tag.slug,
                                icon: tag.icon,
                                isSearchable: tag.isSearchable,
                                isAmenity: tag.isAmenity,
                            },
                        });
                        payload.logger.info(`Tag ${tag.slug} created.`);


                        //add the tag to the unit
                        await payload.update({
                            collection: 'units',
                            id: updateUnit.id,
                            data: {
                                // Assumes 'tags' is an array field
                                tags: [...(updateUnit.tags || []), newTag.id ],
                            },
                        });

                    } else {
                        payload.logger.info(`Tag ${tag.slug} already exists.`);
                        //add the tag to the unit
                        await payload.update({
                            collection: 'units',
                            id: updateUnit.id,
                            data: {
                                // Assumes 'tags' is an array field
                                tags: [...(updateUnit.tags || []), existingDocs.docs[0].id ],
                            },
                        });
                    }




                }
            }

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
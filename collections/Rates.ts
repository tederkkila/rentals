import type { CollectionConfig } from "payload"

export const Rates: CollectionConfig = {
    slug: "rates",
    admin: {
        defaultColumns: ["unit", "year", "peak", "price"],
    },
    fields: [
        {
            name: "year",
            type: "number",
            required: true,
        },
        {
            name: "peak",
            type: "checkbox",
            defaultValue: false,
            admin: {
                description: "If checked, this is a peak rate"
            },
        },
        {
            name: "unit",
            type: "relationship",
            relationTo: "units",
            required: true,
            hasMany: false,
        },
        {
            name: "price",
            type: "number",
            required: true,
        }

    ],
};
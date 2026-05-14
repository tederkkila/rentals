import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
    slug: "customers",
    admin: {
        useAsTitle: "email",
    },
    fields: [
        {
            name: "email",
            type: "email",
            required: true,
        },
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "phone",
            type: "text",
        },
        {
            name: "addressStreet",
            type: "text",
        },
        {
            name: "addressState",
            type: "text",
        },
        {
            name: "addressPostalCode",
            type: "text",
        },
        {
            name: "addressCountry",
            type: "text",
        }
    ]
}
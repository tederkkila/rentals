import type { CollectionConfig } from 'payload'

export const Units: CollectionConfig = {
    slug: "units",
    fields: [
        {
            name: "name",
            type: "text",
            required: true
        },
        {
            name: "slug",
            type: "text",
            required: true,
            unique: true,
            index: true,
        },

    ]
};
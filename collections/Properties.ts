import type { CollectionConfig } from 'payload'

export const Properties: CollectionConfig = {
    slug: "Properties",
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
import type { CollectionConfig } from 'payload'

export const Attractions: CollectionConfig = {
    slug: "Attractions",
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
        {
            name: "image",
            type: "upload",
            relationTo: "media",
        }
    ]
};
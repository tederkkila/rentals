import type { CollectionConfig } from 'payload'

export const Units: CollectionConfig = {
    slug: "units",
    admin: {
        useAsTitle: "name",
    },
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
            name: "isPrivate",
            label: "Private",
            defaultValue: false,
            type: "checkbox",
            admin: {
                description: "If checked, you must be authenticated to view unit"
            },
        },
        {
            name: "isArchived",
            label: "Archive",
            defaultValue: false,
            type: "checkbox",
            admin: {
                description: "If checked, this unit will be archived"
            },
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
        },
        {
            name: "coverImage",
            type: "upload",
            relationTo: "media",
        },
        {
            name: "guests",
            type: "number",
            required: true,
        },
        {
            name: "bathrooms",
            type: "number",
            required: true,
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: true,
        }

    ]
};
import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from "@/lib/access";

export const Attractions: CollectionConfig = {
    slug: "attractions",
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
            name: "url",
            type: "text",
            required: true,
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            name: "isFavorite",
            label: "Favorite",
            defaultValue: false,
            type: "checkbox",
            admin: {
                description: "If checked, this attraction will appear on unit view"
            },
        },
    ]
};
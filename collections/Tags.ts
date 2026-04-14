import type { CollectionConfig } from "payload"

import { isSuperAdmin } from "@/lib/access";

export const Tags: CollectionConfig = {
    slug: "tags",
    orderable: true,
    defaultSort: "_order",
    access: {
        read: () => true,
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
        delete: ({ req }) => isSuperAdmin(req.user),
    },
    admin: {
        useAsTitle: "name",
        hidden: ({ user }) => !isSuperAdmin(user),
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
            unique: true,
        },
        {
            name: "slug",
            type: "text",
            required: true,
            unique: true,
        },{
            name: "icon",
            type: "text",
        },
        {
            name: "isSearchable",
            defaultValue: false,
            type: "checkbox",
            admin: {
                description: "If checked, this tag appears in search filters"
            },
        },
        {
            name: "isAmenity",
            defaultValue: true,
            type: "checkbox",
            admin: {
                description: "If checked, tag is an amenity"
            },
        }
    ],
};
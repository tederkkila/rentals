import type { CollectionConfig } from 'payload';

import { isSuperAdmin } from '@/lib/access';

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    access: {
        create: ({ req }) => isSuperAdmin(req.user),
        delete: ({ req }) => isSuperAdmin(req.user),
    },
    admin: {
        useAsTitle: 'slug',
    },
    fields: [
        {
            name: "name",
            required: true,
            type: "text",
            label: "Store Name",
            admin: {
                description: "This is the name of the store (e.g. Antonio's Store)",
            },
        },
        {
            name: "slug",
            type: "text",
            index: true,
            required: true,
            unique: true,
            access: {
                update: ({ req }) => isSuperAdmin(req.user),
            },
            admin: {
                description:
                    "This is the subdomain for the store (e.g. [slug].henrymitchell.net)",
            },
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
        }
    ],
};
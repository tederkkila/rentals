import type { CollectionConfig } from 'payload'

import {
    lexicalEditor,
    FixedToolbarFeature,
    HeadingFeature,
    OrderedListFeature,
    UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const Units: CollectionConfig = {
    slug: "units",
    orderable: true,
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
            name: "quickDescription",
            type: "text",
            required: true,
            admin: {
                description: "This is the quick description of the unit used on the unit listing page",
            },
        },
        {
            name: "content",
            type: "richText",
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                    ...defaultFeatures,
                    // Add a fixed toolbar
                    FixedToolbarFeature(),
                    // Add custom features
                    HeadingFeature({}),
                    OrderedListFeature(),
                    UnorderedListFeature(),
                ],
            }),
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
            name: "size",
            type: "number",
            admin: {
                description: "Size in square feet",
            }
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: true,
            admin: {
                description: "Tags for this unit",
                isSortable: true,
            }
        },
        {
            name: 'gallery',
            type: 'upload',
            relationTo: 'media',
            required: true,
            hasMany: true // This enables multiple images
        },
        {
            name: 'rates',
            type: "join",
            collection: "rates",
            on: "unit",
        },
        {
            name: 'peakseasons',
            type: "join",
            collection: "peakseasons",
            on: "unit",
        },
        {
            name: 'discounts',
            type: "join",
            collection: "discounts",
            on: "unit",
            admin: {
                description: "Note: Discounts are not yet implemented"
            },
        },
        {
            name: 'taxInfo',
            type: 'text',
            admin: {
                description: "This text is displayed under the calendar on a unit"
            },
        },

    ]
};
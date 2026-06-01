import type { CollectionConfig, Field } from 'payload'

import {
    lexicalEditor,
    FixedToolbarFeature,
    HeadingFeature,
    OrderedListFeature,
    UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    admin: {
        useAsTitle: 'slug',
    },
    defaultPopulate: {
        attractions: false,
        content: false,
        contact: false,
    },
    fields: [
        {
            name: "name",
            required: true,
            type: "text",
            label: "Location Name",
            admin: {
                description: "This is the name of the location",
            },
        },
        {
            name: "slug",
            type: "text",
            index: true,
            required: true,
            unique: true,
            admin: {
                description:
                    "This is the subdomain for the location (e.g. [slug].henrymitchell.net)",
            },
        },
        {
            name: "tax",
            type: "number",
            required: true,
            defaultValue: 0,
            admin: {
                description: "This is the tax rate for the location",
            },
        },
        {
            name: "timezone",
            type: "select",
            options: [
                {label: 'Vermont', value: 'America/New_York'},
                {label: 'Whistler', value: 'America/Vancouver'},
                {label: 'Maui', value: 'Pacific/Honolulu'},
            ],
            defaultValue: 'America/New_York',
            required: true,
            admin: {
                description: "This is the timezone for the location",
            },
        },
        {
            name: "icon",
            type: "upload",
            required: true,
            relationTo: "media",
        },
        {
            name: "image",
            type: "upload",
            required: true,
            relationTo: "media",
        },
        {
            name: 'favicon',
            type: 'upload',
            relationTo: 'media', // Points to your Payload media collection
            required: false,
        },
        {
            name: "attractions",
            type: "relationship",
            relationTo: "attractions",
            hasMany: true,
            admin: {
                description: "Attractions for this tenant",
                isSortable: true,
            }
        },
        {
            name: "content",
            type: "richText",
            admin: {
                description: "This is the description of the location",
            },
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
            name: "contact",
            type: "richText",
            admin: {
                description: "This Tenants contact information",
            },
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
        }
    ] as Field[],
}
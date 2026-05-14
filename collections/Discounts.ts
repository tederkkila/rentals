import type { CollectionConfig, Field } from 'payload'

export const Discounts: CollectionConfig = {
    slug: "discounts",

    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "unit",
            type: "relationship",
            relationTo: "units",
            hasMany: false,
            required: true,
        },
        {
            name: "price",
            type: "number",
            required: true,
        },
        {
            name: 'priceType',
            type: 'select',
            options: [
                {label: 'Per Night', value: 'night'},
                {label: 'Per Week', value: 'week'},
                {label: 'Per Month', value: 'month'},
            ],
            required: true,
            defaultValue: 'week',
        },
        {
            name: "minimumNights",
            type: "number",
            required: true,
        },
        {
            name: "startDate",
            type: "date",
            required: true,
            timezone: {
                defaultTimezone: 'America/New_York',
                supportedTimezones: [
                    {label: 'Vermont', value: 'America/New_York'},
                    {label: 'Whistler', value: 'America/Vancouver'},
                    {label: 'Maui', value: 'Pacific/Honolulu'},
                ],
            },
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                    displayFormat: 'd MMM yyyy, HH:mm',
                },
            },

        },
        {
            name: "endDate",
            type: "date",
            required: true,
            timezone: {
                defaultTimezone: 'America/New_York',
                supportedTimezones: [
                    {label: 'Vermont', value: 'America/New_York'},
                    {label: 'Whistler', value: 'America/Vancouver'},
                    {label: 'Maui', value: 'Pacific/Honolulu'},
                ],
            },
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                    displayFormat: 'd MMM yyyy, HH:mm',
                },
            },
        },
    ] as Field[]
}
import type { CollectionConfig, Field } from 'payload'

export const PeakSeasons: CollectionConfig = {
    slug: "peakseasons",
    admin: {
        defaultColumns: ["name", "tenant", "unit", "price", "priceType", "startDate", "endDate"],
        useAsTitle: "name",
    },

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
            timezone: true,
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
            timezone: true,
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                    displayFormat: 'd MMM yyyy, HH:mm',
                },
            },
        },
    ] as Field[]
}
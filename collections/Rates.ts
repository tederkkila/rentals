import type { CollectionConfig, Field } from "payload"

export const Rates: CollectionConfig = {
    slug: "rates",
    admin: {
        description: "The default rate for a unit before peak rate and/or discount is applied",
        defaultColumns: ["name", "unit", "price", "priceType", "startDate", "endDate"],
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
            required: true,
            hasMany: false,
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

    ] as Field[],
};
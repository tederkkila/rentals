import type { CollectionConfig, Field } from "payload"

export const Rates: CollectionConfig = {
    slug: "rates",
    admin: {
        description: "The default rate for a unit before peak rate and/or discount is applied",
        defaultColumns: ["name", "active", "unit", "price", "priceType", "startDate", "endDate"],
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            label: "Status",
            type: "group",
            fields: [
                {
                    name: "active",
                    type: "checkbox",
                    defaultValue: true,
                    admin: {
                        description: "If checked, is active in calendar. Inactives still appear on unit page"
                    }
                },
                {
                    name: "archived",
                    type: "checkbox",
                    defaultValue: false,
                    admin: {
                        description: "If checked, overrides 'active' and  will not appear in calendar or unit page"
                    }
                },
            ],
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
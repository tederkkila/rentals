import type { CollectionConfig, Field } from 'payload'

export const PeakSeasons: CollectionConfig = {
    slug: "peakseasons",
    admin: {
        defaultColumns: ["name", "active", "unit", "price", "priceType", "startDate", "endDate"],
        useAsTitle: "name",
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
            label: "Calendar Shading",
            type: "group",
            admin: {
                description: "See https://tailwindcss.com/docs/colors",
            },
            fields: [
                {
                    name: "color",
                    type: "select",
                    options: [
                        {label: 'White', value: 'white'},
                        {label: 'Red', value: 'red'},
                        {label: 'Orange', value: 'orange'},
                        {label: 'Amber', value: 'amber'},
                        {label: 'Yellow', value: 'yellow'},
                        {label: 'Lime', value: 'lime'},
                        {label: 'Green', value: 'green'},
                        {label: 'Emerald', value: 'emerald'},
                        {label: 'Teal', value: 'teal'},
                        {label: 'Cyan', value: 'cyan'},
                        {label: 'Sky', value: 'sky'},
                        {label: 'Blue', value: 'blue'},
                        {label: 'Indigo', value: 'indigo'},
                        {label: 'Violet', value: 'violet'},
                        {label: 'Purple', value: 'purple'},
                        {label: 'Fuchsia', value: 'fuchsia'},
                        {label: 'Pink', value: 'pink'},
                        {label: 'Rose', value: 'rose'},
                    ],
                    defaultValue: 'white',
                    required: true,
                },
                {
                    name: "colorstep",
                    title: "Color Step",
                    type: "select",
                    options: [
                        {label: '50', value: '50'},
                        {label: '100', value: '100'},
                        {label: '200', value: '200'},
                        {label: '300', value: '300'},
                        {label: '400', value: '400'},
                        {label: '500', value: '500'},
                        {label: '600', value: '600'},
                        {label: '700', value: '700'},
                        {label: '800', value: '800'},
                        {label: '900', value: '900'},
                        {label: '950', value: '950'},
                    ]
                },
            ]
        },
        {
            name: "startDate",
            type: "date",
            index: true,
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
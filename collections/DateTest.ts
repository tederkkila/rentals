import type { CollectionConfig, Field } from 'payload'

export const DateTest: CollectionConfig = {
    slug: "datetest",
    fields: [
        {
            name: "date",
            type: "date",
            admin: {
                date: {
                    pickerAppearance: 'dayOnly',
                },
            },
            required: true,
        },
    ] as Field[]
}
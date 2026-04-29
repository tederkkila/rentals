import type { CollectionConfig } from 'payload'

export const Reservations: CollectionConfig = {
    slug: "reservations",
    fields: [
        {
            name: "customer",
            type: "relationship",
            relationTo: "customers",
            hasMany: false,
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
            name: "startDate",
            type: "date",
            required: true,
        },
        {
            name: "EndDate",
            type: "date",
            required: true,
        },
        {
            type: 'select',
            options: [
                { label: "pending", value: "pending" },
                { label: "confirmed", value: "confirmed" },
                { label: "cancelled", value: "cancelled" },
            ],
        },
        {
            name: "notes",
            type: "textarea",
        },
        {
            name: "quote",
            type: "number",
            required: true,
        },
        {
            name: "amountPaid",
            type: "number",
            required: true,
        },
        {
            name: "depositPaid",
            type: "number",
            required: true,
        },
        {
            name: "cleaningDate",
            type: "date",
        },
        {
            name: "cleaningNotes",
            type: "textarea",
        },
    ]
}
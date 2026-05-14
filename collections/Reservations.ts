import type { CollectionConfig, Field } from 'payload'

const RESERVATION_STATUS_OPTIONS = [
    {label: 'Pending', value: 'pending'},
    {label: 'Confirmed', value: 'confirmed'},
    {label: 'Cancelled', value: 'cancelled'},
] as const

export const Reservations: CollectionConfig = {
    slug: 'reservations',
    fields: [
        {
            name: 'customer',
            type: 'relationship',
            relationTo: 'customers',
            hasMany: false,
            required: true,
        },
        {
            name: 'unit',
            type: 'relationship',
            relationTo: 'units',
            hasMany: false,
            required: true,
        },
        {
            name: 'startDate',
            type: 'date',
            timezone: true,
            required: true,
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                    displayFormat: 'd MMM yyyy, HH:mm',
                },
            },
        },
        {
            name: 'endDate',
            type: 'date',
            timezone: true,
            required: true,
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                    displayFormat: 'd MMM yyyy, HH:mm',
                },
            },
        },
        {
            name: 'status',
            type: 'select',
            options: RESERVATION_STATUS_OPTIONS,
            required: true,
            defaultValue: 'pending',
        },
        {
            name: 'quote',
            type: 'number',
            required: true,
        },
        {
            name: 'amountPaid',
            type: 'number',
            required: true,
        },
        {
            name: 'depositPaid',
            type: 'number',
            required: true,
        },
        {
            name: 'notes',
            type: 'textarea',
        },
        {
            name: 'cleaningDate',
            type: 'date',
            timezone: true,
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                    displayFormat: 'd MMM yyyy, HH:mm',
                },
            },
        },
        {
            name: 'cleaningNotes',
            type: 'textarea',
        },
    ] as Field[],

}
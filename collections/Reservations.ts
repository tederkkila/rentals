import type { CollectionConfig, Field } from 'payload'
import {Customer} from "@/payload-types";

const RESERVATION_STATUS_OPTIONS = [
    {label: 'Pending', value: 'pending'},
    {label: 'Confirmed', value: 'confirmed'},
    {label: 'Cancelled', value: 'cancelled'},
] as const

export const Reservations: CollectionConfig = {
    slug: 'reservations',
    admin: {
        description: "Listing of Reservations by TENANT (Select from the dropdown if required)",
        defaultColumns: ["status", "customer", "unit", "quote", "startDate", "endDate"],
    },
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
    hooks: {
        afterChange: [
            async ({ doc, operation, req }) => {
            console.log("afterChange Hook")
                // Triggers strictly on new database row creation
                if (operation === 'create') {
                    try {

                        let customer: Customer;
                        if (typeof doc.customer === 'string') {

                            const customerId = doc.customer as unknown as string;

                            customer = await req.payload.findByID({
                                collection: 'customers',
                                id: customerId,
                                depth: 2,
                            } as Parameters<typeof req.payload.findByID>[0]);
                            console.log(customer.email);
                        } else {
                            // If it was already populated via depth
                            customer = doc.customer
                            console.log(doc.customer.email);
                        }

                        // Using Payload's native abstractions routes directly via Resend
                        await req.payload.sendEmail({
                            to: 'delivered@resend.dev',
                            subject: '🚀 New Reservation Added!',
                            html: `
            <h3>New Lead Details:</h3>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Name:</strong> ${customer.name}</p>
          `,
                        })
                    } catch (error) {
                        req.payload.logger.error(`Resend failed to send email: ${error}`)
                    }
                }
            },
        ],
    },
}
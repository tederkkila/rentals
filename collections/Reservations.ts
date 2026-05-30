import type { CollectionConfig, Field } from 'payload'
import {Customer, Unit} from "@/payload-types";

const RESERVATION_STATUS_OPTIONS = [
    {label: 'Pending', value: 'pending'},
    {label: 'Confirmed', value: 'confirmed'},
    {label: 'Cancelled', value: 'cancelled'},
    {label: 'Archived', value: 'archived'},
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
            index: true,
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
                // Triggers strictly on new database row creation
                if (operation === 'create') {
                    try {

                        let customer: Customer;
                        if (typeof doc.customer === 'string') {

                            const customerId = doc.customer as unknown as string;

                            customer = (
                                await req.payload.find({
                                    collection: 'customers',
                                    depth: 2,
                                    limit: 1,
                                    where: {
                                        id: {
                                            equals: customerId,
                                        },
                                    },
                                })
                            ).docs[0];
                        } else {
                            // If it was already populated via depth
                            customer = doc.customer
                        }

                        let unit: Unit;
                        if (typeof doc.unit === 'string') {

                            const unitId = doc.unit as unknown as string;

                            unit = (
                                await req.payload.find({
                                    collection: 'units',
                                    depth: 2,
                                    limit: 1,
                                    where: {
                                        id: {
                                            equals: unitId,
                                        },
                                    },
                                })
                            ).docs[0];
                        } else {
                            // If it was already populated via depth
                            unit = doc.unit
                        }

                        const tenant =
                            typeof unit.tenant === "object" && unit.tenant !== null
                                ? unit.tenant
                                : null;

                        if (!tenant) {
                            throw new Error("Tenant not found");
                        }

                        // Using Payload's native abstractions routes directly via Resend
                        const messageVariables: Record<string, any> = {
                            caspian: {
                                emoji: "🌲",
                                emails: ['tederkkila@gmail.com'],
                            },
                            mauicondo: {
                                emoji: "🌋",
                                emails: ['tederkkila@gmail.com'],
                            },
                            whistler: {
                                emoji: "🏔️",
                                emails: ['tederkkila@gmail.com'],
                            },
                        }

                        const messageVariable: Record<string, any> = messageVariables[tenant.slug]
                        //console.log("unit", unit);

                        const emailTO =(process.env.APP_ENV == 'development') ? 'delivered@resend.dev' : messageVariable.emails
                        const subject = `${messageVariable.emoji} ${tenant.slug.toUpperCase()}: New Reservation Request for ${unit.name.toUpperCase()}!`
                        const reservationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/collections/reservations/${doc.id}`

                        const localStartTime: string = new Date(doc.startDate).toLocaleString('en-US', { timeZone: doc.startDate_tz });
                        const localEndTime: string = new Date(doc.endDate).toLocaleString('en-US', { timeZone: doc.endDate_tz });

                        await req.payload.sendEmail({
                            to: emailTO,
                            from: 'no-reply@henrymitchell.net',
                            subject: subject,
                            html: `
            <h3>New Reservation Details:</h3>
            <p>
                <strong>Email:</strong> ${customer.email}</br>
                <strong>Name:</strong> ${customer.name}</br>
                <strong>Start Date:</strong> ${localStartTime} (${doc.startDate_tz})</br>
                <strong>End Date:</strong> ${localEndTime}  (${doc.endDate_tz})</br>
                <strong>Status:</strong> ${doc.status}</br>
                
            </p>
            <p>Click here to review the reservation<br>
            <a href="${reservationUrl}" target="_blank">${reservationUrl}</a>
            </p>
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
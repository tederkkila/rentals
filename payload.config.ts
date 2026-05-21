import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import type { Config } from './payload-types'

import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { isSuperAdmin } from './lib/access';
// import { getUserTenantIDs } from './lib/getUserTenantIDs'
import { getUserTenantIDs } from '@payloadcms/plugin-multi-tenant/utilities';

import { Users } from './collections/Users'
import { Tenants } from "@/collections/Tenants";
import { Units } from "@/collections/Units";
import { Media } from './collections/Media'
import { Categories } from "@/collections/Categories";
import { Attractions } from "@/collections/Attractions";
import { Rates } from "@/collections/Rates";
import { Tags } from "@/collections/Tags";
import { Customers } from "@/collections/Customers";
import { Reservations } from "@/collections/Reservations";
import { PeakSeasons } from "@/collections/PeakSeasons";
import { Discounts } from "@/collections/Discounts";

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import { resendAdapter } from '@payloadcms/email-resend'

//TODO add CSRF protection
//https://payloadcms.com/docs/authentication/cookies#csrf-attacks

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        timezones: {
            supportedTimezones: [
                {
                    label: 'Vermont',
                    value: 'America/New_York',
                },
                {
                    label: 'Whistler',
                    value: 'America/Vancouver',
                },
                {
                    label: 'Maui',
                    value: 'Pacific/Honolulu',
                },
            ],
            //defaultTimezone: 'America/New_York',
        },
    },
    collections: [Users,Customers, Reservations, Tenants, Units, Rates, Attractions, PeakSeasons, Discounts, Media, Categories, Tags],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: mongooseAdapter({
        url: process.env.DATABASE_URL || '',
    }),
    sharp,
    plugins: [
        multiTenantPlugin<Config>({
            collections: {
                units: {},
                rates: {},
                peakseasons: {},
                discounts: {},
                reservations: {},
                attractions: {},
                media: {},
            },
            tenantField: {
                access: {
                    read: () => true,
                    update: ({ req }) => {
                        if (isSuperAdmin(req.user)) {
                            return true
                        }
                        return getUserTenantIDs(req.user).length > 0
                    },
                },
            },
            tenantsArrayField: {
                includeDefaultField: false,
            },
            userHasAccessToAllTenants: (user) => isSuperAdmin(user),
        })
    ],
    email: resendAdapter({
        defaultFromAddress: 'onboarding@resend.dev', //for dev
        defaultFromName: 'Local Dev Bot', //for dev
        apiKey: process.env.RESEND_API_KEY || '', // Grabbed from your Resend dashboard
    }),
})

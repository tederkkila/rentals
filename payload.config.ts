import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import type { Config } from './payload-types'

import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { isSuperAdmin } from './lib/access';
import { getUserTenantIDs } from './lib/getUserTenantIDs'

import { Users } from './collections/Users'
import { Tenants } from "@/collections/Tenants";
import { Units } from "@/collections/Units";
import { Media } from './collections/Media'
import { Categories } from "@/collections/Categories";
import { Attractions } from "@/collections/Attractions";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    collections: [Users, Tenants, Units, Attractions, Media, Categories],
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
                units: {}
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
})

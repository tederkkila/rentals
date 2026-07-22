import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

    images: {
        // Whitelist your Payload media domains here
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
            },
            {
                protocol: 'http', // Required for local development
                hostname: 'localhost',
            },
        ],
    },

    async redirects() {
        return [
            // 1. Static path to subdomain
            {
                source: '/caspian',
                destination: 'https://caspian.henrymitchell.net',
                permanent: true, // Uses 308 permanent redirect status code
            },
            // 2. Dynamic path matching (e.g., forwarding slugs)
            // {
            //     source: '/docs/:slug*',
            //     destination: 'https://example.com*',
            //     permanent: false, // Uses 307 temporary redirect status code
            // },
        ]
    },


    // Add this if you use SQLite or other native drivers
    serverExternalPackages: ['@payloadcms/db-mongodb', '@payloadcms/db-postgres'],
};

// export default withPayload(nextConfig);

export default withPayload(nextConfig, {
    // Try setting this to false if the error persists
    devBundleServerPackages: false
})

//TODO add for production
/*
module.exports = {
  compiler: {
    // Remove all console.* calls in production
    removeConsole: process.env.NODE_ENV === "production",
  },
}
*/
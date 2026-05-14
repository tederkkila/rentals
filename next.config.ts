import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
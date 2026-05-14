import payload from 'payload';
import path from 'path';
import { getPayload } from 'payload';
import config from "@payload-config";

const updateMediaTenants = async () => {
    // Initialize the Payload local API
    const payload = await getPayload({ config });

    // Replace this with your actual Tenant ID (ObjectId string)
    const targetTenantId = '69d84100fb6b895e28b1a8a5';

    try {
        // 1. Fetch all media documents
        const mediaItems = await payload.find({
            collection: 'media',
            limit: 0, // Fetch all records
            depth: 0, // No need to populate relationships for a metadata update
        });

        console.log(`Found ${mediaItems.totalDocs} media items to update.`);

        // 2. Batch update using Promise.all
        const updates = mediaItems.docs.map(async (doc) => {
            try {
                return await payload.update({
                    collection: 'media',
                    id: doc.id,
                    data: {
                        tenant: targetTenantId, // Assign the tenant ObjectId
                    },
                });
            } catch (err) {
                console.error(`Failed to update media ID: ${doc.id}`, err.message);
            }
        });

        await Promise.all(updates);
        console.log('Update complete!');

    } catch (error) {
        console.error('Error during update script:', error);
    } finally {
        process.exit(0);
    }
};

updateMediaTenants();

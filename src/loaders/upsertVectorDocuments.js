import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// TODO: move this to the utils file couldnt figure out the typescript issue
const getPolicyAreaSlug = (input) => {
    return input
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
        .trim(); // Trim leading and trailing spaces or hyphens
}

// Initialize Supabase client

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Initialize TheAnswer API client
const theAnswerApi = axios.create({
    baseURL: 'https://public.flowise.theanswer.ai',
    headers: {
        'Content-Type': 'application/json'
    }
});

async function upsertVectorDocuments() {
    try {
        // Query Supabase for bills
        const { data: bills, error } = await supabase
            .from('Bill')
            .select('*');

        if (error) throw error;

        for (const bill of bills) {
            // Prepare metadata
            const metadata = {
                title: bill.title,
                summary: bill.summary,
                introducedDate: bill.introducedDate,
                lastUpdatedDate: bill.lastUpdatedDate,
                tags: bill.tags,
                policyArea: getPolicyAreaSlug(bill.policyArea),
                id: bill.id,
                congress: bill.congress,
                source_link: bill.source_link
            };

            // Prepare override config
            const overrideConfig = {
                url: bill.latestTextVersionUrl,
                metadata: metadata
            };

            // Upsert vector document
            const response = await theAnswerApi.post('/api/v1/vector/upsert/00752d2f-c580-43dc-9ab7-1b87cde4e0ba', {
                overrideConfig: overrideConfig
            });

            console.log(response.data);

            console.log(`Upserted vector document for bill: ${bill.id}`);
        }

        console.log('All vector documents upserted successfully');
    } catch (error) {
        console.error('Error upserting vector documents:', error);
    }
}

upsertVectorDocuments();
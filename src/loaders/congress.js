import createCongressApi from '../apis/congress.js';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Function to generate a hash from a string
function generateHash(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

const normalizeBill = async (billUrl, CongressApi) => {
  const fullBill = await CongressApi.getBill(billUrl);
  const { bill } = fullBill;
  const billTags = await CongressApi.getBillTags(bill?.subjects?.url);
  const latestTextVersionUrl = await CongressApi.getSourceContent(bill?.textVersions?.url, 'text')
  const latestPdfVersionUrl = await CongressApi.getSourceContent(bill?.textVersions?.url, 'pdf')
  const latestSummary = await CongressApi.getLatestSummary(bill?.summaries?.url, 'pdf')
  return {
    id: generateHash(bill?.url || bill?.title),
    title: bill.title,
    summary: latestSummary || '',
    tags: billTags,
    source_link: billUrl,
    locale: 'FEDERAL',
    date_added: new Date().toISOString(),
    policyArea: bill?.policyArea ? bill.policyArea.name : 'Unknown',
    actionsUrl: bill?.actions?.url || '',
    summariesUrl: bill?.summaries?.url || '',
    latestTextVersionUrl: latestTextVersionUrl,
    latestPdfVersionUrl: latestPdfVersionUrl,
    introducedDate: bill?.introducedDate || null,
    lastUpdatedDate: bill?.updateDate || null,
  }
}
async function getBillsFromCongress(congressNumber = null, billType = null) {
  try {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const currentCongress = congressNumber || Math.floor((currentYear - 1789) / 2) + 1;

    console.log(`Fetching bills from the ${currentCongress}th Congress (${lastYear}-${currentYear})...`);

    let offset = 0;
    const limit = 5; // Adjust as needed
    const isTestingMode = true;

    // Create a new CongressApi instance with the provided congress number and bill type
    const CongressApi = createCongressApi(currentCongress, billType);

    const paginatedBills = await CongressApi.getBills({ offset, limit, testing: isTestingMode });

    // Process bills in smaller batches
    const batchSize = 10;
    for (let i = 0; i < paginatedBills.length; i += batchSize) {
      const batch = paginatedBills.slice(i, i + batchSize);
      const billsData = await Promise.all(batch.map(async bill => await normalizeBill(bill.url, CongressApi)));

      // Process each bill individually
      for (const billData of billsData) {
        try {
          console.log('Processing bill:', billData.source_link);
          const { error } = await supabase
            .from('Bill')
            .upsert(billData, { onConflict: 'id' })
            .select();

          if (error) {
            console.error('Supabase error:', error);
            throw error;
          }
          console.log('Bill processed successfully');
        } catch (error) {
          console.error('Error processing bill:', error);
          // Log additional information about the bill that caused the error
          console.error('Problematic bill data:', JSON.stringify(billData, null, 2));
        }
      }

      console.log(`Batch ${i / batchSize + 1} processed`);
    }

    console.log(`Total bills processed: ${paginatedBills.length}`);
  } catch (error) {
    console.error('Error fetching or saving bills:', error);
  }
}

// Export the function instead of running it immediately
export default getBillsFromCongress;

// Handle process termination
process.on('SIGINT', () => {
  process.exit();
});

import CongressApi from '../apis/congress.js';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Function to generate a hash from a string
function generateHash(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

async function getBillsFromCongress() {
  try {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const currentCongress = Math.floor((currentYear - 1789) / 2) + 1;

    console.log(`Fetching bills from the ${currentCongress}th Congress (${lastYear}-${currentYear})...`);

    let offset = 0;
    const limit = 5; // Adjust as needed
    const isTestingMode = true;

    const paginatedBills = await CongressApi.getBills(currentCongress, null, null, { offset, limit, testing: isTestingMode });

    // Process bills in smaller batches
    const batchSize = 10;
    for (let i = 0; i < paginatedBills.length; i += batchSize) {
      const batch = paginatedBills.slice(i, i + batchSize);
      const billsData = batch.map(bill => ({
        id: generateHash(bill?.url || bill?.title),
        title: bill.title,
        summary: bill?.summary || '',
        tags: bill?.subjects || [],
        source_link: bill?.url || '',
        pdf_link: bill?.gpo_pdf_uri || '',
        locale: 'FEDERAL',
        topics: bill?.policy_area ? [bill.policy_area.name] : [],
      }));

      // Process each bill individually
      for (const billData of billsData) {
        try {
          console.log('Processing bill:', billData.source_link);
          const { data, error } = await supabase
            .from('Law')
            .upsert(billData, { onConflict: 'id' })
            .select();

          if (error) {
            console.error('Supabase error:', error);
            throw error;
          }
          console.log('Bill processed successfully', data);
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

// Run the function
getBillsFromCongress();

// Handle process termination
process.on('SIGINT', () => {
  process.exit();
});

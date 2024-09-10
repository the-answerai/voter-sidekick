import getBillsFromCongress from './congress.js';
import CongressDownloader from './downloader.js';
// const congressNumbers = [115, 116, 117, 118]; // 2017-2024
const billTypes = ['hr', 's', 'hjres', 'sjres'];
const congressNumbers = [118]; // 2017-2024
// const billTypes = ['hr'];

async function fetchAllBills() {
    for (const congress of congressNumbers) {
        for (const billType of billTypes) {
            await getBillsFromCongress(congress, billType);
        }
    }
}
fetchAllBills();

// async function downloadBills() {
//     const outputDir = './data/bills';
//     for (const congress of congressNumbers) {
//         for (const billType of billTypes) {
//             const downloader = new CongressDownloader(outputDir);
//             await downloader.downloadBills({ congress, billType });
//         }
//     }
// }

// downloadBills();
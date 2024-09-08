import getBillsFromCongress from './congress.js';

const congressNumbers = [115, 116, 117, 118]; // 2017-2024
const billTypes = ['hr', 's', 'hjres', 'sjres'];

async function fetchAllBills() {
    for (const congress of congressNumbers) {
        for (const billType of billTypes) {
            await getBillsFromCongress(congress, billType);
        }
    }
}

fetchAllBills();
import congressApi from "../apis/congress";

// Example usage
async function fetchBillData() {
  try {
    const bills = await congressApi.getBills(117);
    // console.log(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
  }
}

fetchBillData();

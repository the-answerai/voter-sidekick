import fs from "fs/promises";
import path from "path";
import createCongressApi from "../apis/congress.js";

class CongressDownloader {
  constructor(outputDir, defaultCongress = null, defaultBillType = null) {
    this.outputDir = outputDir;
    this.congressApi = createCongressApi(defaultCongress, defaultBillType);
  }

  async downloadBills(options = {}) {
    const congress = options.congress || this.congressApi.defaultCongress;
    const billType = options.billType || this.congressApi.defaultBillType;
    const startOffset = options.offset || 0;

    // console.log('Output Directory:', this.outputDir);
    // console.log('Congress:', congress);
    // console.log('Bill Type:', billType);
    // console.log('Starting Offset:', startOffset);

    if (!this.outputDir) {
      throw new Error("Output directory is not set");
    }

    if (!congress || !billType) {
      throw new Error("Congress and bill type are required");
    }

    const folderPath = path.join(this.outputDir, congress.toString());
    await fs.mkdir(folderPath, { recursive: true });

    const fileName = `${billType}.json`;
    const filePath = path.join(folderPath, fileName);

    let existingData = { bills: [], offset: 0 };
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      existingData = JSON.parse(fileContent);
      //   console.log(
      //     `Resuming from existing file. Current offset: ${existingData.offset}`
      //   );
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Error reading existing file:", error);
      }
    }

    let offset = Math.max(startOffset, existingData.offset);
    const limit = options.limit || 250;

    while (true) {
      const url = `/bill/${congress}/${billType}`;
      const response = await this.congressApi.makeRequest(url, {
        ...options,
        offset,
        limit,
      });

      if (!response.bills || response.bills.length === 0) {
        console.log("No more bills found or reached the end of pagination.");
        break;
      }

      existingData.bills = existingData.bills.concat(response.bills);
      existingData.offset = offset + response.bills.length;

      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
      //   console.log(
      //     `Updated file: ${filePath} with ${response.bills.length} new bills. Total: ${existingData.bills.length} / ${response.pagination?.count}`
      //   );

      if (
        response.bills.length < limit ||
        existingData.bills.length >= response.pagination?.count ||
        options.testing
      ) {
        break;
      }

      offset += limit;
    }

    // console.log(
    //   `Finished downloading bills for Congress ${congress}, bill type ${billType}`
    // );
    // console.log(`Total bills downloaded: ${existingData.bills.length}`);
  }
}

export default CongressDownloader;

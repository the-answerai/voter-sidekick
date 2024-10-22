/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.CONGRESS_API_KEY;
const BASE_URL = "https://api.congress.gov/v3";

class CongressApi {
  constructor(defaultCongress = null, defaultBillType = null) {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      params: {
        api_key: API_KEY,
        format: "json",
      },
    });

    const currentYear = new Date().getFullYear();
    const currentCongress = Math.floor((currentYear - 1789) / 2) + 1;

    this.defaultCongress = defaultCongress || currentCongress;
    this.defaultBillType = defaultBillType;
  }

  async getBills(options = {}) {
    let url = `/bill/${this.defaultCongress}/${this.defaultBillType}`;
    return this.getPaginatedResults(url, options);
  }

  async getBill(billUrl) {
    if (!billUrl) return {};
    return this.makeRequest(billUrl);
  }

  async getBillTags(subjectsUrl) {
    if (!subjectsUrl) return [];
    const response = await this.makeRequest(subjectsUrl);
    return (
      response.subjects?.legislativeSubjects?.map((subject) => subject.name) ||
      []
    );
  }

  async getSourceContent(textVersionsUrl, type) {
    if (!textVersionsUrl) return "";
    try {
      const response = await this.makeRequest(textVersionsUrl);
      const textVersions = response.textVersions || [];

      // Sort text versions by date in descending order
      const sortedVersions = textVersions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      for (const version of sortedVersions) {
        const format = version.formats.find((f) =>
          f.type.toLowerCase().includes(type.toLowerCase())
        );
        if (format) {
          return format.url;
        }
      }
    } catch (err) {
      console.error("Error getting source content", err);
    }

    return "";
  }

  async getBillActions(congress, billType, billNumber, options = {}) {
    return this.getPaginatedResults(
      `/bill/${congress}/${billType}/${billNumber}/actions`,
      options
    );
  }

  async getBillAmendments(congress, billType, billNumber, options = {}) {
    return this.getPaginatedResults(
      `/bill/${congress}/${billType}/${billNumber}/amendments`,
      options
    );
  }

  async getBillCosponsors(congress, billType, billNumber, options = {}) {
    return this.getPaginatedResults(
      `/bill/${congress}/${billType}/${billNumber}/cosponsors`,
      options
    );
  }

  async getBillSubjects(congress, billType, billNumber, options = {}) {
    return this.getPaginatedResults(
      `/bill/${congress}/${billType}/${billNumber}/subjects`,
      options
    );
  }

  async getLatestSummary(summariesUrl) {
    if (!summariesUrl) return "";
    const response = await this.makeRequest(summariesUrl);
    const latestSummary = response.summaries.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return latestSummary[0]?.text;
  }

  async getBillSummaries(congress, billType, billNumber, options = {}) {
    return this.getPaginatedResults(
      `/bill/${congress}/${billType}/${billNumber}/summaries`,
      options
    );
  }

  async getBillText(congress, billType, billNumber, options = {}) {
    return this.getPaginatedResults(
      `/bill/${congress}/${billType}/${billNumber}/text`,
      options
    );
  }

  async getMembers(bioguideId, options = {}) {
    let url = "/member";
    if (bioguideId) {
      url += `/${bioguideId}`;
    }
    return this.getPaginatedResults(url, options);
  }

  async getMemberSponsoredLegislation(bioguideId, options = {}) {
    return this.getPaginatedResults(
      `/member/${bioguideId}/sponsored-legislation`,
      options
    );
  }

  async getMemberCosponsoredLegislation(bioguideId, options = {}) {
    return this.getPaginatedResults(
      `/member/${bioguideId}/cosponsored-legislation`,
      options
    );
  }

  async getPaginatedResults(url, options = {}) {
    let allResults = [];
    let offset = 0;
    const limit = options.limit || 250;

    while (true) {
      const response = await this.makeRequest(url, {
        ...options,
        offset,
        limit,
      });
      // console.log('NUM ITEMS', response.pagination.count);
      if (!response.bills && !response.amendments && !response.actions) {
        // If the response doesn't have a standard structure, return it as-is
        return response;
      }

      const results =
        response.bills || response.amendments || response.actions || [];
      allResults = allResults.concat(results);

      if (
        results.length < limit ||
        allResults.length >= response.pagination?.count ||
        options.testing
      ) {
        break;
      }

      offset += limit;
    }

    return allResults;
  }

  async makeRequest(url, params = {}) {
    try {
      const response = await this.axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw error;
    }
  }
}

// Export a function to create a new instance instead of exporting a singleton
export default function createCongressApi(
  defaultCongress = null,
  defaultBillType = null
) {
  return new CongressApi(defaultCongress, defaultBillType);
}

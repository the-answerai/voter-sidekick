/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.CONGRESS_API_KEY;
const BASE_URL = 'https://api.congress.gov/v3';

class CongressApi {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
            params: {
                api_key: API_KEY,
                format: 'json',
            },
        });
    }

    async getBills(congress, billType, billNumber, options = {}) {
        let url = '/bill';
        if (congress) {
            url += `/${congress}`;
            if (billType) {
                url += `/${billType}`;
                if (billNumber) {
                    url += `/${billNumber}`;
                }
            }
        }
        return this.getPaginatedResults(url, options);
    }

    async getBillActions(congress, billType, billNumber, options = {}) {
        return this.getPaginatedResults(`/bill/${congress}/${billType}/${billNumber}/actions`, options);
    }

    async getBillAmendments(congress, billType, billNumber, options = {}) {
        return this.getPaginatedResults(`/bill/${congress}/${billType}/${billNumber}/amendments`, options);
    }

    async getBillCosponsors(congress, billType, billNumber, options = {}) {
        return this.getPaginatedResults(`/bill/${congress}/${billType}/${billNumber}/cosponsors`, options);
    }

    async getBillSubjects(congress, billType, billNumber, options = {}) {
        return this.getPaginatedResults(`/bill/${congress}/${billType}/${billNumber}/subjects`, options);
    }

    async getBillSummaries(congress, billType, billNumber, options = {}) {
        return this.getPaginatedResults(`/bill/${congress}/${billType}/${billNumber}/summaries`, options);
    }

    async getBillText(congress, billType, billNumber, options = {}) {
        return this.getPaginatedResults(`/bill/${congress}/${billType}/${billNumber}/text`, options);
    }

    async getMembers(bioguideId, options = {}) {
        let url = '/member';
        if (bioguideId) {
            url += `/${bioguideId}`;
        }
        return this.getPaginatedResults(url, options);
    }

    async getMemberSponsoredLegislation(bioguideId, options = {}) {
        return this.getPaginatedResults(`/member/${bioguideId}/sponsored-legislation`, options);
    }

    async getMemberCosponsoredLegislation(bioguideId, options = {}) {
        return this.getPaginatedResults(`/member/${bioguideId}/cosponsored-legislation`, options);
    }

    async getPaginatedResults(url, options = {}) {
        let allResults = [];
        let offset = 0;
        const limit = options.limit || 250;

        while (true) {
            const response = await this.makeRequest(url, { ...options, offset, limit });

            if (!response.bills && !response.amendments && !response.actions) {
                // If the response doesn't have a standard structure, return it as-is
                return response;
            }

            const results = response.bills || response.amendments || response.actions || [];
            allResults = allResults.concat(results);

            if (results.length < limit || allResults.length >= response.pagination?.count || options.testing) {
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

export default new CongressApi();

import { type PineconeMetadataFilter } from "@/types";

export const topics = new Map([
  ["economy-taxes", "Economy & Taxes"],
  ["technology", "Technology"],
  ["climate-change-energy", "Climate Change & Energy"],
  ["cryptocurrency", "Cryptocurrency"],
  ["immigration", "Immigration & Border Security"],
  ["healthcare", "Healthcare"],
  ["social-security-medicare", "Social Security & Medicare"],
  ["crime-safety", "Crime & Safety"],
  ["gun-control", "Gun Control"],
  ["voting-rights-election-integrity", "Voting Rights & Election Integrity"],
  ["judiciary-supreme-court", "Judiciary and Supreme Court"],
  ["foreign-policy", "Foreign Policy"],
  ["abortion", "Abortion"],
]);

export const locales = new Map([
  ["local", "Local"],
  ["state", "State"],
  ["federal", "Federal"],
  ["tribal", "Tribal"],
]);

export const getChatflowConfig = (metaDataFilters: PineconeMetadataFilter) => {
  const pineconeMetadataFilter: Partial<PineconeMetadataFilter> = {};

  // Only add non-empty filter values
  Object.entries(metaDataFilters).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      pineconeMetadataFilter[key as keyof PineconeMetadataFilter] = value;
    }
  });

  const config = {
    // responsePrompt: `
    // You are a helpful assistant for a company called AnswerAI.
    // You answer questions about the company's products and services and give users basic account information.
    // You have access to help center articles and the user infromation, role, plan type and location.
    // Answer the users query to the best of your ability based on the context provided. If you are unable to answer the query, you can transfer the conversation to a human agent.
    // You are currently helping the following user:
    // User Name: Adam Harris
    // When giving responses always keep in mind the user's role and location and provide the most relevant information. Always greet the user and ask for their query. If you are unable to answer the query, you can transfer the conversation to a human agent.
    // `,
  };

  // Only add pineconeMetadataFilter if it's not empty
  if (Object.keys(pineconeMetadataFilter).length > 0) {
    config.pineconeMetadataFilter = pineconeMetadataFilter;
  }

  return config;
};

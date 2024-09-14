import { updateResearchProject } from "./supabaseClient";

export async function updateFiltersInDatabase(
  projectId: number,
  filters: { [key: string]: string | string[] | number },
  overrideConfig: any
) {
  try {
    const updatedConfig = { ...overrideConfig };
    updatedConfig.pineconeMetadataFilter = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (key === "topK") {
        updatedConfig.topK = Number(value);
      } else if (Array.isArray(value) && value.length > 0) {
        updatedConfig.pineconeMetadataFilter[key] = { $in: value };
      }
    });

    // Remove any existing filter keys that are not in the new filters
    Object.keys(updatedConfig.pineconeMetadataFilter).forEach((key) => {
      if (!filters[key] || filters[key].length === 0) {
        delete updatedConfig.pineconeMetadataFilter[key];
      }
    });

    // Remove the entire pineconeMetadataFilter if it's empty
    if (Object.keys(updatedConfig.pineconeMetadataFilter).length === 0) {
      delete updatedConfig.pineconeMetadataFilter;
    }

    await updateResearchProject(projectId, {
      overrideConfig: updatedConfig,
      hasFilters:
        Object.keys(updatedConfig.pineconeMetadataFilter || {}).length > 0,
    });

    return updatedConfig;
  } catch (error) {
    console.error("Error updating filters:", error);
    throw new Error("Failed to update filters in database");
  }
}

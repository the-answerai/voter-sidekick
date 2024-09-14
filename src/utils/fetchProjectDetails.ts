import { getResearchProject } from "./supabaseClient";

export async function fetchProjectDetails(projectId: number) {
  try {
    const project = await getResearchProject(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const filters: { [key: string]: string[] } = {};
    if (project.overrideConfig?.pineconeMetadataFilter) {
      Object.entries(project.overrideConfig.pineconeMetadataFilter).forEach(([key, value]) => {
        if (value && typeof value === "object" && "$in" in value) {
          filters[key] = value.$in as string[];
        }
      });
    }
    if (project.overrideConfig?.topK) {
      filters.topK = [project.overrideConfig.topK.toString()];
    }

    return {
      title: project.title,
      description: project.description || "",
      intent: project.intent || "",
      chatflowid: project.chatflowid || null,
      hasFilters: project.hasFilters,
      savedExcerpts: project.savedExcerpts || [],
      filters,
    };
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw new Error("Failed to fetch project details");
  }
}
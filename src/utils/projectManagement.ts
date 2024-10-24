import {
  updateResearchProject,
  VisibilityOptions,
} from "@/utils/supabaseClient";

export const saveProjectChanges = async (
  projectId: number,
  editedTitle: string,
  editedDescription: string,
  editedVisibility: VisibilityOptions,
) => {
  try {
    const updatedProject = await updateResearchProject(projectId, {
      title: editedTitle,
      description: editedDescription,
      visibility: editedVisibility,
      updatedAt: new Date().toISOString(),
    });
    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

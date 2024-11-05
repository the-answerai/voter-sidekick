import { supabase } from "./supabaseClient";
import { ProjectDetails } from "@/types";

export const updateResearchProject = async (
    projectId: number,
    updates: Partial<ProjectDetails>,
) => {
    try {
        const { data, error } = await supabase
            .from("ResearchProject")
            .update(updates)
            .eq("id", projectId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        console.error("Error updating research project:", error);
        throw error;
    }
};

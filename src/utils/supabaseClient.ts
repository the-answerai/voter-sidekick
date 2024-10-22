import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export enum VisibilityOptions {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  SHARED = "SHARED",
}

export type ProjectObj = {
  id?: number;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  intent?: string;
  userId?: number;
  savedDocuments?: string[]; // Array of Bill IDs
  savedExcerpts?: any[]; // Array of JSON objects
  overrideConfig?: any; // New field for full chatbot configuration
  tags?: string[];
  visibility?: VisibilityOptions; // Use the exported enum
  chatflowid?: string;
  hasFilters?: boolean;
};

export async function getUniquePolicyAreas() {
  const { data, error } = await supabase
    .from("Bill")
    .select("policyArea")
    .not("policyArea", "is", null)
    .order("policyArea");

  if (error) {
    console.error("Error fetching policy areas:", error);
    return [];
  }

  const uniquePolicyAreas = Array.from(
    new Set(data.map((item) => item.policyArea)),
  );
  return uniquePolicyAreas;
}

export async function getResearchProject(projectId: number) {
  const { data, error } = await supabase
    .from("ResearchProject")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching research project:", error);
    return null;
  }

  return data;
}

export async function getBill(billId: string) {
  const { data, error } = await supabase
    .from("Bill")
    .select("*")
    .eq("id", billId)
    .single();

  if (error) {
    console.error("Error fetching bill:", error);
    return null;
  }

  return data;
}

export async function updateResearchProject(
  projectId: number,
  updates: ProjectObj,
) {
  const { data: updatedProject, error, status } = await supabase
    .from("ResearchProject")
    .update(updates)
    .eq("id", projectId)
    .select("*")
    .single();

  if (status !== 200) {
    console.error(
      `Error updating research project (Status: ${status}):`,
      error,
    );
    let errorMessage = `Failed to update research project. Status: ${status}.`;

    if (status === 404) {
      errorMessage += " Project not found.";
    } else if (status === 500) {
      errorMessage += " Internal server error.";
    } else if (error) {
      errorMessage += ` Error: ${error.message}`;
    }

    return { error: errorMessage };
  }

  return { updatedProject };
}

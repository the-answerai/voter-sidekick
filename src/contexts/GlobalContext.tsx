"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import { supabase } from "@/utils/supabaseClient";

interface ResearchProject {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  chatflowid: string | null;
  hasFilters: boolean;
}

interface GlobalContextType {
  isAdmin: boolean;
  projects: ResearchProject[];
  fetchProjects: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const [chatProps, setChatProps] = useState<CBotProps | null>(() => ({
  //   ...defaultChatProps,
  //   chatflowConfig: {
  //     ...defaultChatProps.chatflowConfig,
  //     pineconeNamespace: process.env.NEXT_PUBLIC_PINECONE_NAMESPACE,
  //     pineconeMetadataFilter: {
  //       ...defaultChatProps.chatflowConfig?.pineconeMetadataFilter,
  //     },
  //   },
  // }));

  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<ResearchProject[]>([]);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("ResearchProject").select("*");
    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
  };

  useEffect(() => {
    setIsAdmin(process.env.NEXT_PUBLIC_IS_ADMIN === "true");
    fetchProjects(); // Initial fetch of projects
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isAdmin,
        projects,
        fetchProjects,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

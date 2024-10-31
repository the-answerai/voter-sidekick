"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { CBotProps, PineconeMetadataFilter, SourceDocument } from "../types";
import defaultChatProps from "../chatbots/default";
import { updateFilter } from "../utils/updateFilter";
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
  updateMetadataFilter: (
    key: string,
    value: string | number | string[]
  ) => void;
  updateTopK: (value: number) => void;
  isAdmin: boolean;
  projects: ResearchProject[];
  fetchProjects: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chatProps, setChatProps] = useState<CBotProps | null>(() => ({
    ...defaultChatProps,
    chatflowConfig: {
      ...defaultChatProps.chatflowConfig,
      pineconeNamespace: process.env.NEXT_PUBLIC_PINECONE_NAMESPACE,
      pineconeMetadataFilter: {
        ...defaultChatProps.chatflowConfig?.pineconeMetadataFilter,
      },
    },
  }));
  const [sourceDocuments, setSourceDocuments] = useState<SourceDocument[]>([]);
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

  const updateMetadataFilter = useCallback(
    (key: string, value: string | number | string[]) => {
      setChatProps((prevProps) => {
        if (!prevProps) return null;

        const prevFilter = (prevProps.chatflowConfig?.pineconeMetadataFilter ||
          {}) as PineconeMetadataFilter;
        const formattedValue = Array.isArray(value) ? { $in: value } : value;
        const updatedFilter = updateFilter(prevFilter, key, formattedValue);

        return {
          ...prevProps,
          chatflowConfig: {
            ...prevProps.chatflowConfig,
            pineconeMetadataFilter: updatedFilter,
          },
        };
      });
    },
    []
  );

  const updateTopK = useCallback((value: number) => {
    setChatProps((prevProps) => {
      if (!prevProps) return null;

      return {
        ...prevProps,
        chatflowConfig: {
          ...prevProps.chatflowConfig,
          topK: value,
        },
      };
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        updateMetadataFilter,
        updateTopK,
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

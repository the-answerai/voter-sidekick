"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { SourceDocument, CBotProps } from "../types";
import defaultChatProps, { Message } from "../chatbots/default";
import { fetchProjectDetails } from "@/utils/fetchProjectDetails";
import { updateResearchProject } from "@/utils/updateResearchProject";
import type { ProjectDetails, Document } from "@/types";
import { handleMessageObservation } from "@/utils/handleMessageObservation";
import { VisibilityOptions } from "@/utils/supabaseClient";

interface ProjectContextType {
  // Project Details State
  projectDetails: ProjectDetails | null;
  isLoading: boolean;
  errorMessage: string | null;

  // Source Documents State
  sourceDocuments: SourceDocument[];
  citedSources: any[];
  groupedSources: Record<string, any>;
  selectedDocument: any;
  currentExcerptIndex: number;
  followUpQuestions: string[];

  // Chat Configuration
  chatProps: CBotProps | null;
  overrideConfig: any;

  // Document State
  currentDocument: Document | null;
  setCurrentDocument: (doc: Document | null) => void;

  // Actions
  setProjectDetails: (details: ProjectDetails) => void;
  updateProjectDetails: (updates: Partial<ProjectDetails>) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  addSourceDocuments: (newDocuments: SourceDocument[]) => void;
  clearSourceDocuments: () => void;
  setCitedSources: (sources: any[]) => void;
  setGroupedSources: (sources: Record<string, any>) => void;
  setSelectedDocument: (doc: any) => void;
  setCurrentExcerptIndex: (index: number) => void;
  setFollowUpQuestions: (questions: string[]) => void;

  // Project Loading
  loadProjectDetails: (projectId: number) => Promise<void>;
}

// Define the context before using it
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Project Details State
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Source Documents State
  const [sourceDocuments, setSourceDocuments] = useState<SourceDocument[]>([]);
  const [citedSources, setCitedSources] = useState<any[]>([]);
  const [groupedSources, setGroupedSources] = useState<Record<string, any>>({});
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [currentExcerptIndex, setCurrentExcerptIndex] = useState(0);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);

  // Chat Configuration State
  const [chatProps, setChatProps] = useState<CBotProps | null>(() => ({
    ...defaultChatProps,
    chatflowConfig: {
      ...defaultChatProps.chatflowConfig,
      pineconeNamespace: process.env.NEXT_PUBLIC_PINECONE_NAMESPACE,
    },
    observersConfig: {
      ...defaultChatProps.observersConfig,
      //   observeMessages: async (messages?: Message[]) => {},
      observeStreamEnd: async (messages?: Message[]) => {
        console.log("Stream End 2:", messages);
        if (defaultChatProps?.observersConfig?.observeStreamEnd) {
          await defaultChatProps?.observersConfig.observeStreamEnd(messages);
        }
        try {
          const { citedSources, followUpQuestions } =
            await handleMessageObservation(
              messages,
              addSourceDocuments,
              clearSourceDocuments
            );

          console.log({ citedSources, followUpQuestions });

          memoizedSetCitedSources(citedSources);
          memoizedSetFollowUpQuestions(followUpQuestions);
        } catch (error) {
          console.error("Error in message observation:", error);
        }
      },
    },
  }));

  const [overrideConfig, setOverrideConfig] = useState({});

  // Document State
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);

  // Load Project Details
  const loadProjectDetails = useCallback(async (projectId: number) => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const details = await fetchProjectDetails(projectId);
      if (details) {
        setProjectDetails({
          ...details,
          visibility: details.visibility || VisibilityOptions.PRIVATE,
          savedExcerpts: details.savedExcerpts || [],
        });
      }
    } catch (error) {
      console.error("Error loading project details:", error);
      setErrorMessage("Failed to load project details");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProjectDetails = async (updates: Partial<ProjectDetails>) => {
    if (!projectDetails?.id) return;

    try {
      const updatedProject = await updateResearchProject(
        projectDetails.id,
        updates
      );
      if (updatedProject) {
        setProjectDetails({ ...projectDetails, ...updates });
      }
    } catch (error) {
      console.error("Error updating project:", error);
      setErrorMessage("Failed to update project details");
    }
  };

  // Source Documents Methods
  const addSourceDocuments = useCallback((newDocuments: SourceDocument[]) => {
    setSourceDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      newDocuments.forEach((newDoc) => {
        const existingDocIndex = updatedDocuments.findIndex(
          (doc) =>
            doc.metadata.url === newDoc.metadata.url &&
            doc.metadata["loc.pageNumber"] === newDoc.metadata["loc.pageNumber"]
        );

        if (existingDocIndex === -1) {
          updatedDocuments.push(newDoc);
        } else {
          updatedDocuments[existingDocIndex] = newDoc;
        }
      });
      return updatedDocuments;
    });
  }, []);

  const clearSourceDocuments = useCallback(() => {
    setSourceDocuments([]);
  }, []);

  const memoizedSetCitedSources = useCallback(
    (sources: any[]) => {
      console.log({ sources });
      setCitedSources(sources);

      if (sources.length > 0) {
        const grouped = sources.reduce<Record<string, any>>((acc, source) => {
          if (!acc[source.id]) {
            acc[source.id] = { ...source, chunks: [] };
          }
          acc[source.id].chunks.push(...source.chunks);
          return acc;
        }, {});
        setGroupedSources(grouped);
      }
    },
    [setCitedSources, setGroupedSources]
  );

  const memoizedSetFollowUpQuestions = useCallback((questions: string[]) => {
    setFollowUpQuestions(questions);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projectDetails,
        isLoading,
        errorMessage,
        sourceDocuments,
        citedSources,
        groupedSources,
        selectedDocument,
        currentExcerptIndex,
        followUpQuestions,
        chatProps,
        overrideConfig,
        currentDocument,
        setCurrentDocument,
        setProjectDetails,
        updateProjectDetails,
        setIsLoading,
        setErrorMessage,
        addSourceDocuments,
        clearSourceDocuments,
        setCitedSources,
        setGroupedSources,
        setSelectedDocument,
        setCurrentExcerptIndex,
        setFollowUpQuestions,
        loadProjectDetails,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};

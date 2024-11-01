"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
// import { updateFilter } from "../utils/updateFilter";

import type {
  SourceDocument,
  //   PineconeMetadataFilter,
  CBotProps,
  PineconeMetadataFilter,
  CitedSource,
  CitedSourceChunk,
  Message,
} from "../types";

import { fetchProjectDetails } from "@/utils/fetchProjectDetails";
import { updateResearchProject } from "@/utils/updateResearchProject";
import type { ProjectDetails, Document } from "@/types";
import { handleMessageObservation } from "@/utils/handleMessageObservation";
import { VisibilityOptions } from "@/utils/supabaseClient";
import { getChatflowConfig } from "@/chatbots/config/chatflowConfig";
import getThemeColors from "@/chatbots/getThemeColors";

export interface ProjectContextType {
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
  //   overrideConfig: any;

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
  //   updateMetadataFilter: (
  //     key: string,
  //     value: string | number | string[]
  //   ) => void;
  //   updateTopK: (value: number) => void;
  // Project Loading
  loadProjectDetails: (projectId: number) => Promise<void>;
}

// Define the context before using it
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// const findCitedSourceByUrlAndPage = (
//   documents: SourceDocument[],
//   sourceUrl: string,
//   pageNumber: string
// ): SourceDocumentMetadata | undefined => {
//   return documents.find(
//     (doc: SourceDocument) =>
//       sourceUrl &&
//       pageNumber &&
//       doc.sourceUrl === sourceUrl &&
//       doc?.["loc.pageNumber"] === pageNumber
//   );
// };

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
  const [currentExcerpt, setCurrentExcerpt] = useState<SourceDocument>();
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);

  // New state variable for loading status
  const [isLoadingState, setIsLoadingState] = useState<boolean>(false);

  // New state variable for stream end status
  const [isStreamEnded, setIsStreamEnded] = useState<boolean>(false);

  // Function to run when currentExcerpt changes
  const handleCurrentExcerptChange = (source: SourceDocument | undefined) => {
    if (source) {
      try {
        const id = source?.metadata?.url || source?.metadata?.sourceUrl;
        if (!id) throw new Error("Source ID is missing");

        const pageNumber = source?.metadata?.["loc.pageNumber"]?.toString();
        if (!pageNumber) throw new Error("Page number is missing");

        const matchingDocument = groupedSources[id];
        if (!matchingDocument) throw new Error("Matching document not found");

        setCurrentDocument(matchingDocument);

        const excerptIndex = matchingDocument.chunks.findIndex(
          (item: CitedSourceChunk) => item.pageNumber.toString() === pageNumber
        );

        if (excerptIndex !== -1) {
          setCurrentExcerptIndex(excerptIndex);
        } else {
          setCurrentExcerptIndex(0);
        }
      } catch (error) {
        console.log({ source });
        console.error("Error handling current excerpt change:", error);
      }
    }
  };

  // useEffect to watch for changes in currentExcerpt
  useEffect(() => {
    handleCurrentExcerptChange(currentExcerpt);
  }, [currentExcerpt]);

  const setSourcesAndQuestions = async (messages?: Message[]) => {
    if (!messages?.length) return;

    try {
      const { citedSources, followUpQuestions } =
        await handleMessageObservation(
          messages,
          addSourceDocuments,
          clearSourceDocuments
        );
      memoizedSetCitedSources(citedSources || []);
      memoizedSetFollowUpQuestions(followUpQuestions || []);
    } catch (error) {
      console.error("Error in message observation:", error);
    }
  };

  // Chat Configuration State
  const [chatProps, setChatProps] = useState<CBotProps | null>(() => {
    const defaultMetaDataFilters: PineconeMetadataFilter = {
      // url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB1047",
      // source: "https://s3.theanswer.ai/sb1047",
    };

    const themeColors = getThemeColors("rgb(107, 114, 128)");

    const defaultProps: CBotProps = {
      chatflowid: "9ee4eee1-931d-4007-bc9f-b1431ddabfa9",
      apiHost: "https://prod.studio.theanswer.ai",
      chatflowConfig: {
        ...getChatflowConfig(defaultMetaDataFilters),
        pineconeNamespace: process.env.NEXT_PUBLIC_PINECONE_NAMESPACE,
      },
      observersConfig: {
        observeUserInput: async (_userInput: string) => {
          // Do something here
        },

        observeLoading: async (_loading: boolean) => {
          setIsLoadingState(_loading); // Useful if we want to use this state to change UI.   Also used for initial load of old chat in observeMessages
        },

        observeMessages: async (messages?: Message[]) => {
          if ((messages?.length || 0) <= 1) return;

          if (!isLoadingState && !isStreamEnded) {
            await setSourcesAndQuestions(messages);
          }
        },

        observeStreamEnd: async (messages?: Message[]) => {
          setIsStreamEnded(true); // Set for the first time it was actually streamed
          if ((messages?.length || 0) <= 1) return;

          await setSourcesAndQuestions(messages);
        },
      },
      theme: {
        button: {
          size: "medium",
          backgroundColor: themeColors.buttonBackgroundColor,
          iconColor: themeColors.buttonIconColor,
          customIconSrc: "https://example.com/icon.png",
          bottom: 10,
          right: 10,
        },
        chatWindow: {
          showTitle: true,
          title: "Voter Sidekick",
          showAgentMessages: false,
          welcomeMessage:
            "📢 Quick Disclaimer: While AI can sometimes make mistakes, just like politicians do (though perhaps not quite as often!), I strive for accuracy. This tool is for educational and entertainment purposes only. Please do your own research and verify information from original sources.",
          errorMessage: "This is a custom error message",
          backgroundColor: themeColors.chatWindowBackgroundColor,
          height: -1,
          width: -1,
          sourceBubble: {
            hideSources: false,
            getLabel: (source: any) => {
              return (
                source?.metadata["loc.pageNumber"] ||
                source?.metadata?.["pdf.info.Title"] ||
                source?.metadata?.congress
              );
            },
            onSourceClick: (source: any) => {
              if (source?.metadata) {
                const url =
                  source.metadata.url ||
                  source.metadata.sourceUrl ||
                  source.metadata.soureUrl;
                source.metadata.sourceUrl = url;
              }
              console.log(source);
              setCurrentExcerpt(source);
            },
          },
          poweredByTextColor: themeColors.chatWindowPoweredByTextColor,
          botMessage: {
            backgroundColor: themeColors.botMessageBackgroundColor,
            textColor: themeColors.botMessageTextColor,
            showAvatar: false,
          },
          userMessage: {
            backgroundColor: themeColors.userMessageBackgroundColor,
            textColor: themeColors.userMessageTextColor,
            showAvatar: false,
          },
          textInput: {
            placeholder: "Type your message...",
            backgroundColor: themeColors.textInputBackgroundColor,
            textColor: themeColors.textInputTextColor,
            sendButtonColor: themeColors.userMessageBackgroundColor,
            maxChars: 200,
            maxCharsWarningMessage: "You have exceeded the character limit.",
            autoFocus: true,
            sendMessageSound: false,
            receiveMessageSound: false,
          },
          feedback: {
            color: themeColors.feedbackColor,
          },
          footer: {
            textColor: themeColors.footerTextColor,
          },
        },
      },
    };

    return defaultProps;
  });

  //   const [overrideConfig, setOverrideConfig] = useState({});

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
          id: projectId,
          visibility:
            ("visibility" in details &&
              (details.visibility as VisibilityOptions)) ||
            VisibilityOptions.PRIVATE,
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
            (doc.metadata.url === newDoc.metadata.url ||
              doc.metadata.sourceUrl === newDoc.metadata.sourceUrl) &&
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
      console.log({ cited: sources });
      setCitedSources(sources);

      if (sources.length > 0) {
        const grouped = sources.reduce<Record<string, any>>((acc, source) => {
          const url = source.url || source.sourceUrl || source.soureUrl;
          if (!acc[source.id]) {
            acc[source.id] = { ...source, chunks: [], sourceUrl: url };
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

  //   const updateMetadataFilter = useCallback(
  //     (key: string, value: string | number | string[]) => {
  //         setChatProps((prevProps) => {
  //           if (!prevProps) return null;
  //           const prevFilter = (prevProps.chatflowConfig?.pineconeMetadataFilter ||
  //             {}) as PineconeMetadataFilter;
  //           const formattedValue = Array.isArray(value) ? { $in: value } : value;
  //           const updatedFilter = updateFilter(prevFilter, key, formattedValue);
  //           return {
  //             ...prevProps,
  //             chatflowConfig: {
  //               ...prevProps.chatflowConfig,
  //               pineconeMetadataFilter: updatedFilter,
  //             },
  //           };
  //         });
  //     },
  //     []
  //   );

  //   const updateTopK = useCallback((value: number) => {
  //     // setChatProps((prevProps) => {
  //     //   if (!prevProps) return null;
  //     //   return {
  //     //     ...prevProps,
  //     //     chatflowConfig: {
  //     //       ...prevProps.chatflowConfig,
  //     //       topK: value,
  //     //     },
  //     //   };
  //     // });
  //   }, []);

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
        // overrideConfig,
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

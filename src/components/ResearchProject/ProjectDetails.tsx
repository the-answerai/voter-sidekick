"use client";
import React, { useState, useEffect } from "react";
import { useChatContext } from "../../contexts/ChatContext";

import ChatFullPage from "../ChatFullPage";
import UserIntent from "./UserIntent";
import FollowUpQuestions from "./FollowUpQuestions";
import CitedSources from "./CitedSources";
import ResearchHeader from "./ResearchHeader";

import getUserIntent from "@/utils/getUserIntentGoal";

import {
  getBill,
  updateResearchProject,
  type ProjectObj,
  VisibilityOptions,
} from "@/utils/supabaseClient";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import SavedDocuments from "./SavedDocuments";

import { fetchProjectDetails } from "@/utils/fetchProjectDetails";

import { handleMessageObservation } from "@/utils/handleMessageObservation";

import { handleFollowUpQuestion } from "@/utils/handleFollowUpQuestion";

import { updateFiltersInDatabase } from "@/utils/updateFiltersInDatabase";

// import { PineconeMetadataFilter } from "@/types";

import { Loader } from "lucide-react"; // Import the Loader icon

type Excerpt = {
  sourceId: string;
  chunk: string;
  savedAt: string;
};

const ResearchProject: React.FC<{ projectId: number }> = ({ projectId }) => {
  const {
    chatProps,
    // sourceDocuments,
    addSourceDocuments,
    clearSourceDocuments,
  } = useChatContext();
  // const [savedDocuments, setSavedDocuments] = useState([]);
  const [citedSources, setCitedSources] = useState<any[]>([]);
  // const [topics, setTopics] = useState(new Map());
  const [overrideConfig, setOverrideConfig] = useState({});
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [userIntent, setUserIntent] = useState<string>("");
  // const [isEditingIntent, setIsEditingIntent] = useState(false);

  const [groupedSources, setGroupedSources] = useState<Record<string, any>>({});
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [currentExcerptIndex, setCurrentExcerptIndex] = useState(0);

  const [projectTitle, setProjectTitle] = useState("Loading...");
  const [projectDescription, setProjectDescription] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedVisibility, setEditedVisibility] = useState<VisibilityOptions>(
    VisibilityOptions.PRIVATE
  );
  const [isPublicConfirmationOpen, setIsPublicConfirmationOpen] =
    useState(false);

  // const [selectedFilters, setSelectedFilters] = useState<{
  //   [key: string]: string[] | number;
  // }>({});

  const [chatflowid, setChatflowID] = useState<string | null>(null);
  // const [hasFilters, setHasFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedExcerpts, setSavedExcerpts] = useState<Excerpt[]>([]);

  // const minTopK = 4;
  // const maxTopK = 30;

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectDetails = async () => {
      setIsLoading(true);
      try {
        const projectDetails = await fetchProjectDetails(projectId);
        setProjectTitle(projectDetails.title);
        setProjectDescription(projectDetails.description);
        setUserIntent(projectDetails.intent || "");
        setChatflowID(projectDetails.chatflowid);
        // setHasFilters(projectDetails.hasFilters);
        // setSelectedFilters(projectDetails.filters);
        setSavedExcerpts(projectDetails.savedExcerpts || []);
      } catch (error) {
        console.error("Error loading project details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectDetails();
  }, [projectId]);

  // useEffect(() => {
  //   const loadTopics = async () => {
  //     const topicsMap = await initializeTopics();
  //     setTopics(topicsMap);
  //   };
  //   loadTopics();
  // }, []);

  useEffect(() => {
    const handleMessageObservationWrapper = async (messages: any[]) => {
      try {
        const { citedSources, followUpQuestions } =
          await handleMessageObservation(
            messages,
            addSourceDocuments,
            clearSourceDocuments
          );
        setCitedSources(citedSources);
        setFollowUpQuestions(followUpQuestions);
      } catch (error) {
        console.error("Error in message observation:", error);
      }
    };

    if (chatProps?.observersConfig?.observeMessages) {
      const originalObserveMessages = chatProps.observersConfig.observeMessages;
      chatProps.observersConfig.observeMessages = async (messages) => {
        originalObserveMessages(messages);
        await handleMessageObservationWrapper(messages);
      };
    }
  }, [chatProps, addSourceDocuments, clearSourceDocuments]);

  useEffect(() => {
    if (chatProps?.chatflowConfig) {
      setOverrideConfig(chatProps.chatflowConfig);
    }
  }, [chatProps]);

  useEffect(() => {
    if (citedSources.length > 0) {
      const grouped = citedSources.reduce<
        Record<string, any & { chunks: string[] }>
      >((acc, source) => {
        if (!acc[source.id]) {
          acc[source.id] = { ...source, chunks: [] };
        }
        acc[source.id].chunks.push(...source.chunks);
        return acc;
      }, {});
      setGroupedSources(grouped);
    }
  }, [citedSources]);

  const handleFollowUpQuestionWrapper = (question: string) => {
    try {
      handleFollowUpQuestion(question, chatProps);
    } catch (error) {
      console.error("Error handling follow-up question:", error);
    }
  };

  const handleDocumentClick = async (documentId: string) => {
    const data = await getBill(documentId);
    setSelectedDocument(data);
    setCurrentExcerptIndex(0);
  };

  const handleSaveExcerpt = async (sourceId: string, chunk: string) => {
    const excerpt = {
      sourceId,
      chunk,
      savedAt: new Date().toISOString(),
    };

    const exists = savedExcerpts.some(
      (ex) => ex.sourceId === sourceId && ex.chunk === chunk
    );
    if (exists) {
      alert("This excerpt is already saved.");
      return;
    }

    const updatedSavedExcerpts = [...savedExcerpts, excerpt];
    setSavedExcerpts(updatedSavedExcerpts);

    try {
      const updatedProject = await updateResearchProject(projectId, {
        savedExcerpts: updatedSavedExcerpts,
      });
      if (!updatedProject) {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error saving excerpt:", error);
    }
  };

  const handleExcerptNavigation = (direction: "prev" | "next") => {
    if (!selectedDocument) return;

    const totalExcerpts = groupedSources[selectedDocument.id].chunks.length;
    if (direction === "prev") {
      setCurrentExcerptIndex((prev) =>
        prev > 0 ? prev - 1 : totalExcerpts - 1
      );
    } else {
      setCurrentExcerptIndex((prev) =>
        prev < totalExcerpts - 1 ? prev + 1 : 0
      );
    }
  };

  const handleEditClick = () => {
    setEditedTitle(projectTitle);
    setEditedDescription(projectDescription);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editedVisibility === "PUBLIC") {
      setIsPublicConfirmationOpen(true);
    } else {
      await saveProjectChanges();
    }
  };

  // const handlePublicConfirmation = async () => {
  //   setIsPublicConfirmationOpen(false);
  //   await saveProjectChanges();
  // };

  const saveProjectChanges = async () => {
    try {
      const {
        updatedProject,
        error,
      }:
        | { updatedProject: ProjectObj; error?: undefined }
        | { updatedProject?: undefined; error: string } =
        await updateResearchProject(projectId, {
          title: editedTitle,
          description: editedDescription,
          visibility: editedVisibility,
          updatedAt: new Date().toISOString(),
        });

      if (error) {
        setErrorMessage(error); // Set the error message
        throw new Error(error);
      }

      if (!updatedProject) {
        const err = "A valid project was not returned.";
        setErrorMessage(err);
        throw new Error(err);
      }

      setProjectTitle(updatedProject.title || "");
      setProjectDescription(updatedProject.description || "");
      setIsEditDialogOpen(false);
      setErrorMessage(null); // Clear the error message on success
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleGenerateIntent = async () => {
    const messages = chatProps?.messages || [];
    const latestMessage = messages[messages.length - 1];
    const intent = await getUserIntent(
      messages.slice(0, -1),
      latestMessage?.message
    );
    setUserIntent(intent);
    await updateResearchProject(projectId, { intent: intent });
  };

  const updateUserIntent = async (intent: string) => {
    setUserIntent(intent);
    await updateResearchProject(projectId, { intent: intent });
  };

  // const handleIntentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setUserIntent(e.target.value);
  // };

  // const handleIntentBlur = async () => {
  //   setIsEditingIntent(false);
  //   await updateResearchProject(projectId, { intent: userIntent });
  // };

  // const updateFiltersInDatabaseWrapper = async (
  //   key: string, // Change from keyof PineconeMetadataFilter to string
  //   value: string | number | string[]
  // ) => {
  //   try {
  //     const updatedFilters = {
  //       ...selectedFilters,
  //       [key]:
  //         Array.isArray(value) || typeof value === "number" ? value : [value],
  //     };
  //     const updatedConfig = await updateFiltersInDatabase(
  //       projectId,
  //       updatedFilters,
  //       overrideConfig
  //     );
  //     setOverrideConfig(updatedConfig);
  //     setSelectedFilters(updatedFilters);
  //   } catch (error) {
  //     console.error("Error updating filters:", error);
  //   }
  // };

  // const handleSaveEditClick = async () => {
  //   setIsSaving(true);
  //   await handleSaveEdit();
  //   setIsSaving(false);
  // };

  return (
    <div className="grid grid-cols-12 grid-rows-[1fr_auto] gap-4 h-[87vh]">
      <div className="col-span-3 row-span-2 p-4 bg-gray-100 overflow-y-auto rounded-md flex flex-col gap-2 sticky top-0 max-h-full">
        <ResearchHeader
          title={projectTitle}
          description={projectDescription}
          handleEditClick={handleEditClick}
        />
        <Tabs defaultValue="intent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="intent"
              className="text-xs data-[state=inactive]:text-gray-500"
            >
              User Intent
            </TabsTrigger>
            <TabsTrigger
              value="cited"
              className="text-xs data-[state=inactive]:text-gray-500"
            >
              Cited Sources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="intent">
            <UserIntent
              userIntent={userIntent}
              updateUserIntent={updateUserIntent}
              handleGenerateIntent={handleGenerateIntent}
              messages={chatProps?.messages || []}
            />
          </TabsContent>
          <TabsContent value="cited">
            <CitedSources
              groupedSources={groupedSources}
              handleDocumentClick={handleDocumentClick}
              selectedDocument={selectedDocument}
              currentExcerptIndex={currentExcerptIndex}
              handleExcerptNavigation={handleExcerptNavigation}
              handleSaveExcerpt={handleSaveExcerpt}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="col-span-9 row-span-1 overflow-scroll max-h-full">
        {!isLoading && chatProps && chatflowid ? (
          <div className="flex flex-col w-full gap-4">
            <div className="h-full w-full">
              <ChatFullPage
                {...chatProps}
                chatflowid={chatflowid}
                className="w-full chatbot  inline-block"
              />
            </div>
          </div>
        ) : (
          <div>Loading chat...</div>
        )}
      </div>

      {!!followUpQuestions?.length && (
        <div className="col-span-9">
          <FollowUpQuestions
            followUpQuestions={followUpQuestions}
            handleFollowUpQuestion={handleFollowUpQuestionWrapper}
          />
        </div>
      )}
    </div>
  );
};

export default ResearchProject;

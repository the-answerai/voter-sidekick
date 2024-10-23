"use client";
import React, { useState, useEffect } from "react";
import { useChatContext } from "../../contexts/ChatContext";
import ChatFullPage from "../ChatFullPage";
import UserIntent from "./UserIntent";
import FollowUpQuestions from "./FollowUpQuestions";
import CitedSources from "./CitedSources";
import ResearchHeader from "./ResearchHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import PineconeMetadataFilterSelect from "../PineconeMetadataFilterSelect";
import {
  congressSessions,
  initializeTopics,
} from "../../chatbots/config/chatflowConfig";
import getUserIntent from "@/utils/getUserIntentGoal";
import { getBill, updateResearchProject } from "@/utils/supabaseClient";
import { cn } from "@/utils/tailwindMerge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedDocuments from "./SavedDocuments";
import { fetchProjectDetails } from "@/utils/fetchProjectDetails";
import { handleMessageObservation } from "@/utils/handleMessageObservation";
import { handleFollowUpQuestion } from "@/utils/handleFollowUpQuestion";
import { updateFiltersInDatabase } from "@/utils/updateFiltersInDatabase";
import { getFollowUpQuestions } from "@/utils/getFollowUpQuestions";
import { Checkbox } from "@/components/ui/checkbox";

const ResearchProject: React.FC<{ projectId: number }> = ({ projectId }) => {
  const {
    chatProps,
    sourceDocuments,
    addSourceDocuments,
    clearSourceDocuments,
  } = useChatContext();
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [citedSources, setCitedSources] = useState<any[]>([]);
  const [topics, setTopics] = useState(new Map());
  const [overrideConfig, setOverrideConfig] = useState({});
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [userIntent, setUserIntent] = useState<string>("");
  const [isEditingIntent, setIsEditingIntent] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [currentExcerptIndex, setCurrentExcerptIndex] = useState(0);

  const [projectTitle, setProjectTitle] = useState("Loading...");
  const [projectDescription, setProjectDescription] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedVisibility, setEditedVisibility] = useState("PRIVATE");
  const [isPublicConfirmationOpen, setIsPublicConfirmationOpen] =
    useState(false);

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[] | number;
  }>({});

  const [chatflowid, setChatflowID] = useState<string | null>(null);
  const [hasFilters, setHasFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedExcerpts, setSavedExcerpts] = useState([]);

  const minTopK = 4;
  const maxTopK = 30;

  useEffect(() => {
    const loadProjectDetails = async () => {
      setIsLoading(true);
      try {
        const projectDetails = await fetchProjectDetails(projectId);
        setProjectTitle(projectDetails.title);
        setProjectDescription(projectDetails.description);
        setUserIntent(projectDetails.intent || "");
        setChatflowID(projectDetails.chatflowid);
        setHasFilters(projectDetails.hasFilters);
        setSelectedFilters(projectDetails.filters);
        setSavedExcerpts(projectDetails.savedExcerpts || []);
      } catch (error) {
        console.error("Error loading project details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectDetails();
  }, [projectId]);

  useEffect(() => {
    const loadTopics = async () => {
      const topicsMap = await initializeTopics();
      setTopics(topicsMap);
    };
    loadTopics();
  }, []);

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

  useEffect(() => {
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

  const handleSaveExcerpt = async (
    sourceId: string,
    chunk: string,
    documentName: string,
    validity: string,
    metadata: any
  ) => {
    const excerpt = {
      sourceId,
      chunk,
      savedAt: new Date().toISOString(),
      documentName,
      validity,
      metadata,
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

  const handleRemoveExcerpt = async (excerptToRemove: any) => {
    const updatedSavedExcerpts = savedExcerpts.filter(
      (excerpt) =>
        excerpt.sourceId !== excerptToRemove.sourceId ||
        excerpt.chunk !== excerptToRemove.chunk
    );
    setSavedExcerpts(updatedSavedExcerpts);

    try {
      const updatedProject = await updateResearchProject(projectId, {
        savedExcerpts: updatedSavedExcerpts,
      });
      if (!updatedProject) {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error removing excerpt:", error);
    }
  };

  const handleExcerptNavigation = (direction: "prev" | "next") => {
    if (!selectedDocument) return;

    const totalExcerpts = citedSources.find(
      (source) => source.id === selectedDocument.id
    )?.chunks.length;
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

  const handlePublicConfirmation = async () => {
    setIsPublicConfirmationOpen(false);
    await saveProjectChanges();
  };

  const saveProjectChanges = async () => {
    try {
      const updatedProject = await updateResearchProject(projectId, {
        title: editedTitle,
        description: editedDescription,
        visibility: editedVisibility,
        updatedAt: new Date().toISOString(),
      });
      if (updatedProject) {
        setProjectTitle(updatedProject.title || "");
        setProjectDescription(updatedProject.description || "");
        setIsEditDialogOpen(false);
      } else {
        console.error("Failed to update project");
      }
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

  const handleIntentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserIntent(e.target.value);
  };

  const handleIntentBlur = async () => {
    setIsEditingIntent(false);
    await updateResearchProject(projectId, { intent: userIntent });
  };

  const updateFiltersInDatabaseWrapper = async (
    key: string,
    value: string | number | string[]
  ) => {
    try {
      const updatedFilters = { ...selectedFilters, [key]: value };
      const updatedConfig = await updateFiltersInDatabase(
        projectId,
        updatedFilters,
        overrideConfig
      );
      setOverrideConfig(updatedConfig);
      setSelectedFilters(updatedFilters);
    } catch (error) {
      console.error("Error updating filters:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-3/4 p-4 flex flex-col chatarea relative">
          {!isLoading && chatProps && chatflowid ? (
            <ChatFullPage
              {...chatProps}
              chatflowid={chatflowid}
              className="w-full flex-1"
            />
          ) : (
            <div>Loading chat...</div>
          )}

          <AnimatePresence>
            {followUpQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="follow-up-questions fixed bottom-4 left-4 right-4 mb-4 space-x-4 z-10"
              >
                <FollowUpQuestions
                  followUpQuestions={followUpQuestions}
                  handleFollowUpQuestion={handleFollowUpQuestionWrapper}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
          <ResearchHeader
            projectTitle={projectTitle}
            projectDescription={projectDescription}
            sourceDocuments={sourceDocuments}
            savedDocuments={savedExcerpts.length}
            handleEditClick={handleEditClick}
          />
          {hasFilters && (
            <Card className="mb-4">
              <CardContent>
                <div className="space-y-4">
                  <PineconeMetadataFilterSelect
                    options={congressSessions}
                    updateFilter={updateFiltersInDatabaseWrapper}
                    filterKey="congress"
                    placeholder="Select Congress"
                    isNumeric={true}
                    isMulti={true}
                    selectedValues={selectedFilters.congress || []}
                  />
                  <PineconeMetadataFilterSelect
                    options={topics}
                    updateFilter={updateFiltersInDatabaseWrapper}
                    filterKey="policyArea"
                    placeholder="Select Topic"
                    isMulti={true}
                    selectedValues={selectedFilters.policyArea || []}
                  />
                  <PineconeMetadataFilterSelect
                    filterKey="topK"
                    updateFilter={updateFiltersInDatabaseWrapper}
                    isNumeric={true}
                    isSlider={true}
                    min={minTopK}
                    max={maxTopK}
                    selectedValues={
                      typeof selectedFilters.topK === "number"
                        ? selectedFilters.topK
                        : minTopK
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}
          <Tabs defaultValue="cited" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cited">Cited Sources</TabsTrigger>
              <TabsTrigger value="saved">Saved Excerpts</TabsTrigger>
            </TabsList>
            <TabsContent value="cited">
              <CitedSources
                citedSources={citedSources}
                handleDocumentClick={handleDocumentClick}
                handleSaveExcerpt={handleSaveExcerpt}
              />
            </TabsContent>
            <TabsContent value="saved">
              <SavedDocuments
                savedExcerpts={savedExcerpts}
                onRemoveExcerpt={handleRemoveExcerpt}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={cn("dialog-content")}>
          <DialogHeader>
            <DialogTitle>Edit Research Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Visibility</Label>
              <RadioGroup
                value={editedVisibility}
                onValueChange={setEditedVisibility}
                className="col-span-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PRIVATE" id="private" />
                  <Label htmlFor="private">Private</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PUBLIC" id="public" />
                  <Label htmlFor="public">Public</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isPublicConfirmationOpen}
        onOpenChange={setIsPublicConfirmationOpen}
      >
        <AlertDialogContent className={cn("alert-dialog-content")}>
          <AlertDialogHeader>
            <AlertDialogTitle>Make Project Public?</AlertDialogTitle>
            <AlertDialogDescription>
              Making your project public will allow anyone to view it. Are you
              sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublicConfirmation}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResearchProject;

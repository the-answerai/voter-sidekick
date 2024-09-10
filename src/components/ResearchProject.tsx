/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import ChatFullPage from "./ChatFullPage";
import { useChatContext } from "../contexts/ChatContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CitedSource, SourceDocument } from "../types";
import { Tooltip } from "@/components/ui/tooltip";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ChevronRight, ChevronLeft } from "lucide-react";
import PineconeMetadataFilterSelect from "./PineconeMetadataFilterSelect";
import SourceDocumentsSidebar from "./SourceDocumentsSidebar";
import {
  congressSessions,
  initializeTopics,
} from "../chatbots/config/chatflowConfig";
import getFollowUpQuestions from "@/utils/getFollwUpQuestions";
import getUserIntent from "@/utils/getUserIntentGoal"; // Add this import
import { getResearchProject, getBill } from "@/utils/supabaseClient"; // Make sure to import your Supabase client
import { updateResearchProject } from "@/utils/supabaseClient"; // Add this import
import { Wand2 } from "lucide-react"; // Import the magic wand icon
import { cn } from "@/utils/tailwindMerge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ResearchProject: React.FC<{ projectId: number }> = ({ projectId }) => {
  const {
    chatProps,
    sourceDocuments,
    addSourceDocuments,
    clearSourceDocuments,
  } = useChatContext();
  const [showingSources, setShowingSources] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState([
    {
      id: 1,
      title: "Clean Air Act Amendments",
      date: "1990-11-15",
      authors: "John Doe, Jane Smith",
      status: "Enacted",
    },
    {
      id: 2,
      title: "Paris Agreement",
      date: "2015-12-12",
      authors: "United Nations",
      status: "Ratified",
    },
  ]);
  const [citedSources, setCitedSources] = useState<CitedSource[]>([]);
  const [topics, setTopics] = useState(new Map());
  const [overrideConfig, setOverrideConfig] = useState({});
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [userIntent, setUserIntent] = useState<string>("");
  const [isEditingIntent, setIsEditingIntent] = useState(false);

  const [groupedSources, setGroupedSources] = useState<Record<string, any>>({});
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
    [key: string]: string[];
  }>({});

  const [topk, setTopk] = useState(5);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const project = await getResearchProject(projectId);
      if (project) {
        setProjectTitle(project.title);
        setProjectDescription(project.description || "");
        setUserIntent(project.intent || "");
        if (project.filters) {
          setOverrideConfig(JSON.parse(project.filters));
          // Parse the filters and set the selectedFilters state
          const parsedFilters = JSON.parse(project.filters);
          const filters: { [key: string]: string[] } = {};
          Object.entries(parsedFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              filters[key] = value;
            } else if (typeof value === "string" || typeof value === "number") {
              filters[key] = [value.toString()];
            }
          });
          setSelectedFilters(filters);
        }
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    const loadTopics = async () => {
      const topicsMap = await initializeTopics();
      setTopics(topicsMap);
    };
    loadTopics();
  }, []);

  const handleMessageObservation = async (messages: any[]) => {
    if (messages.length === 1) {
      clearSourceDocuments();
      setCitedSources([]);
      setShowingSources(false);
      setFollowUpQuestions([]);
      // Don't reset user intent here
    } else {
      const latestMessage = messages[messages.length - 1];
      if (
        latestMessage.type === "apiMessage" &&
        latestMessage.sourceDocuments &&
        Array.isArray(latestMessage.sourceDocuments)
      ) {
        addSourceDocuments(latestMessage.sourceDocuments);
        const newCitedSources: CitedSource[] =
          latestMessage.sourceDocuments.map((doc: SourceDocument) => ({
            id: doc.metadata.id,
            title: doc.metadata.title || "Unknown Title",
            congress: doc.metadata.congress || "Unknown Congress",
            policyArea: doc.metadata.policyArea || "Unknown policyArea",
            chunks: [doc.pageContent],
          }));
        setCitedSources(newCitedSources);
        setShowingSources(true);
        const followUpQuestions = await getFollowUpQuestions(
          messages.slice(0, -1),
          latestMessage.message
        );
        setFollowUpQuestions(followUpQuestions);

        // Don't generate user intent here
      }
    }
  };

  useEffect(() => {
    if (chatProps?.observersConfig?.observeMessages) {
      const originalObserveMessages = chatProps.observersConfig.observeMessages;
      chatProps.observersConfig.observeMessages = async (messages) => {
        originalObserveMessages(messages);
        await handleMessageObservation(messages);
      };
    }
  }, [chatProps, addSourceDocuments, clearSourceDocuments]);

  useEffect(() => {
    if (chatProps?.chatflowConfig) {
      setOverrideConfig(chatProps.chatflowConfig);
    }
  }, [chatProps]);

  const handleSaveDocument = (
    documentId: string,
    chunk: string | null = null
  ) => {
    console.log(
      `Saving ${chunk ? "chunk from" : "entire"} document ${documentId}`
    );
    setSavedDocuments((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: `New Document ${prev.length + 1}`,
        date: new Date().toISOString().split("T")[0],
        authors: "System",
        status: "Added",
      },
    ]);
  };

  const handleFollowUpQuestion = (question: string) => {
    const chatbotElement = document.querySelector("aai-fullchatbot");

    if (chatbotElement) {
      // Check if the chatbotElement has a sendMessage method
      if (typeof (chatbotElement as any).sendMessage === "function") {
        // If it does, use it to send the question
        (chatbotElement as any).sendMessage(question);
        focusInput(chatbotElement);
      } else {
        // If not, try to find the input and submit manually
        const shadowRoot = (chatbotElement as any).shadowRoot;

        if (shadowRoot) {
          const inputElement = shadowRoot.querySelector(
            'input[type="text"]'
          ) as HTMLInputElement;

          if (inputElement) {
            inputElement.value = question;
            inputElement.dispatchEvent(new Event("input", { bubbles: true }));

            const sendButton = shadowRoot.querySelector(
              'button[type="submit"]'
            ) as HTMLButtonElement;

            if (sendButton) {
              sendButton.click();
            } else {
              const form = shadowRoot.querySelector("form");
              if (form) {
                form.dispatchEvent(new Event("submit", { bubbles: true }));
              } else {
                console.error(
                  "No send button or form found in the chatbot shadow DOM"
                );
              }
            }

            // Focus on the input after sending the message
            setTimeout(() => focusInputAndMoveCursor(inputElement), 0);
          } else {
            console.error("Input element not found in the chatbot shadow DOM");
          }
        } else {
          console.error("Shadow DOM not found for the chatbot element");
        }
      }
    } else {
      console.error("<aai-fullchatbot> element not found");
    }

    if (chatProps?.chatflowConfig?.handleUserMessage) {
      chatProps.chatflowConfig.handleUserMessage(question);
    }
  };

  // Helper function to focus on the input
  const focusInput = (chatbotElement: Element) => {
    setTimeout(() => {
      const shadowRoot = (chatbotElement as any).shadowRoot;
      if (shadowRoot) {
        const inputElement = shadowRoot.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement;
        if (inputElement) {
          focusInputAndMoveCursor(inputElement);
        }
      }
    }, 0);
  };

  // Helper function to focus input and move cursor to the end
  const focusInputAndMoveCursor = (inputElement: HTMLInputElement) => {
    inputElement.focus();
    const length = inputElement.value.length;
    inputElement.setSelectionRange(length, length);
  };

  useEffect(() => {
    if (citedSources.length > 0) {
      const grouped = citedSources.reduce<
        Record<string, CitedSource & { chunks: string[] }>
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

  const handleDocumentClick = async (documentId: string) => {
    // Fetch full document details from Supabase
    const data = await getBill(documentId);

    setSelectedDocument(data);
    setCurrentExcerptIndex(0);
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

  const truncateTitle = (title: string, maxLength: number = 75) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
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
    // Save the generated intent to the database
    await updateResearchProject(projectId, { intent: intent });
  };

  const handleIntentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserIntent(e.target.value);
  };

  const handleIntentBlur = async () => {
    setIsEditingIntent(false);
    // Save the updated intent to the database
    await updateResearchProject(projectId, { intent: userIntent });
  };

  const handleFilterSelect = async (
    key: string,
    value: string | number | string[]
  ) => {
    const updatedFilters = { ...selectedFilters };
    if (key === "topK") {
      updatedFilters[key] = value as number;
    } else {
      updatedFilters[key] = value as string[];
    }
    setSelectedFilters(updatedFilters);
    await updateFiltersInDatabase(updatedFilters);
  };

  const handleFilterRemove = async (key: string, value: string) => {
    const updatedFilters = { ...selectedFilters };
    if (Array.isArray(updatedFilters[key])) {
      updatedFilters[key] = (updatedFilters[key] as string[]).filter(
        (v) => v !== value
      );
      if ((updatedFilters[key] as string[]).length === 0) {
        delete updatedFilters[key];
      }
    }
    setSelectedFilters(updatedFilters);
    await updateFiltersInDatabase(updatedFilters);
  };

  const updateFiltersInDatabase = async (filters: {
    [key: string]: string[] | number;
  }) => {
    const updatedConfig = { ...overrideConfig };
    updatedConfig.pineconeMetadataFilter = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (key === "topK") {
        updatedConfig.topK = value as number;
      } else if (key === "congress" || key === "policyArea") {
        if (Array.isArray(value) && value.length > 0) {
          // Use $in operator for congress and policyArea
          updatedConfig.pineconeMetadataFilter[key] = { $in: value };
        }
      } else {
        // For other fields, keep the original format
        updatedConfig.pineconeMetadataFilter[key] = value;
      }
    });

    setOverrideConfig(updatedConfig);
    try {
      await updateResearchProject(projectId, {
        filters: JSON.stringify(updatedConfig),
      });
    } catch (error) {
      console.error("Error updating filters:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Research Summary */}
      <Card className="mb-4 mx-4 mt-4">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{projectTitle}</h2>
            <p className="text-sm text-gray-500">{projectDescription}</p>
          </div>
          <div className="flex space-x-8">
            <div className="text-center">
              <p className="text-sm text-gray-500">Documents Reviewed</p>
              <p className="text-lg font-semibold">{sourceDocuments.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Documents Saved</p>
              <p className="text-lg font-semibold">{savedDocuments.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Key Excerpts</p>
              <p className="text-lg font-semibold">
                {sourceDocuments.length * 2}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Overall Progress</p>
              <p className="text-lg font-semibold">85%</p>
            </div>
          </div>
          <div className="ml-8 flex-shrink-0">
            <Progress value={sourceDocuments.length * 10} className="w-40" />
            <p className="text-sm mt-1">
              {sourceDocuments.length} of 10 recommended documents added
            </p>
          </div>
          <Button onClick={handleEditClick} className="ml-4">
            Edit Project
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-3/4 p-4 flex flex-col">
          {/* Intent and Follow-up Questions */}
          <div className="flex mb-4 space-x-4">
            {/* User Intent */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  User Intent
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateIntent}
                    title="Generate new intent"
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingIntent ? (
                  <Textarea
                    value={userIntent}
                    onChange={handleIntentChange}
                    onBlur={handleIntentBlur}
                    className="w-full"
                  />
                ) : (
                  <p onClick={() => setIsEditingIntent(true)}>{userIntent}</p>
                )}
              </CardContent>
            </Card>

            {/* Follow-up Questions */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Suggested Follow-up Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {followUpQuestions.map((question, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => handleFollowUpQuestion(question)}
                    >
                      {question}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chatbot */}
          {chatProps && (
            <ChatFullPage {...chatProps} className="w-full flex-1" />
          )}
        </div>
        <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Filters
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Override Config</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-md overflow-auto max-h-[60vh]">
                        {JSON.stringify(overrideConfig, null, 2)}
                      </pre>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PineconeMetadataFilterSelect
                  options={congressSessions}
                  updateFilter={handleFilterSelect}
                  removeFilter={handleFilterRemove}
                  filterKey="congress"
                  placeholder="Select Congress"
                  isNumeric={true}
                  isMulti={true}
                  selectedValues={selectedFilters.congress || []}
                />
                <PineconeMetadataFilterSelect
                  options={topics}
                  updateFilter={handleFilterSelect}
                  removeFilter={handleFilterRemove}
                  filterKey="policyArea"
                  placeholder="Select Topic"
                  isMulti={true}
                  selectedValues={selectedFilters.policyArea || []}
                />
                <PineconeMetadataFilterSelect
                  filterKey="topK"
                  updateFilter={handleFilterSelect}
                  removeFilter={handleFilterRemove}
                  isNumeric={true}
                  isSlider={true}
                  min={4}
                  max={30}
                  selectedValues={
                    selectedFilters.topK
                      ? [selectedFilters.topK.toString()]
                      : []
                  }
                />
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {showingSources ? "Cited Sources" : "Saved Documents"}
              </CardTitle>
              {showingSources && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowingSources(false)}
                >
                  <X className="h-4 w-4 mr-2" /> Close Sources
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)]">
                {showingSources ? (
                  <SourceDocumentsSidebar
                    groupedSources={groupedSources}
                    handleDocumentClick={handleDocumentClick}
                    selectedDocument={selectedDocument}
                    currentExcerptIndex={currentExcerptIndex}
                    handleExcerptNavigation={handleExcerptNavigation}
                  />
                ) : (
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle>Saved Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[calc(100vh-350px)]">
                        {savedDocuments.map((doc) => (
                          <Card key={doc.id} className="mb-4">
                            <CardContent className="p-4">
                              <h3 className="font-semibold">{doc.title}</h3>
                              <p className="text-sm">Date: {doc.date}</p>
                              <p className="text-sm">Authors: {doc.authors}</p>
                              <p className="text-sm">Status: {doc.status}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
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

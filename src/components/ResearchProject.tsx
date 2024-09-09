"use client";
import React, { useState, useEffect } from "react";
import ChatFullPage from "./ChatFullPage";
import { useChatContext } from "../contexts/ChatContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PineconeMetadataFilterSelect from "./PineconeMetadataFilterSelect";
import {
  congressSessions,
  initializeTopics,
} from "../chatbots/config/chatflowConfig";
import getFollowUpQuestions from "@/utils/getFollwUpQuestions";
import getUserIntent from "@/utils/getUserIntentGoal"; // Add this import
import { supabase } from "@/utils/supabaseClient"; // Make sure to import your Supabase client

const ResearchProject: React.FC<{ projectId: number }> = ({ projectId }) => {
  const {
    chatProps,
    sourceDocuments,
    addSourceDocuments,
    clearSourceDocuments,
  } = useChatContext();
  const [projectTitle, setProjectTitle] = useState("New Research Project");
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
  const [citedSources, setCitedSources] = useState([]);
  const [topics, setTopics] = useState(new Map());
  const [overrideConfig, setOverrideConfig] = useState({});
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [userIntent, setUserIntent] = useState<string>("");

  const [groupedSources, setGroupedSources] = useState<Record<string, any>>({});
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [currentExcerptIndex, setCurrentExcerptIndex] = useState(0);

  useEffect(() => {
    const loadTopics = async () => {
      const topicsMap = await initializeTopics();
      setTopics(topicsMap);
    };
    loadTopics();
  }, []);

  useEffect(() => {
    if (chatProps?.observersConfig?.observeMessages) {
      const originalObserveMessages = chatProps.observersConfig.observeMessages;
      chatProps.observersConfig.observeMessages = async (messages) => {
        originalObserveMessages(messages);
        if (messages.length === 1) {
          clearSourceDocuments();
          setCitedSources([]);
          setShowingSources(false);
          setFollowUpQuestions([]);
          setUserIntent(""); // Reset user intent
        } else {
          const latestMessage = messages[messages.length - 1];
          if (
            latestMessage.type === "apiMessage" &&
            latestMessage.sourceDocuments
          ) {
            addSourceDocuments(latestMessage.sourceDocuments);
            const newCitedSources = latestMessage.sourceDocuments.map(
              (doc) => ({
                id: doc.metadata.id,
                title: doc.metadata.title || "Unknown Title",
                congress: doc.metadata.congress || "Unknown Congress",
                policyArea: doc.metadata.policyArea || "Unknown policyArea",
                chunks: [doc.pageContent],
              })
            );
            setCitedSources(newCitedSources);
            setShowingSources(true);
            const followUpQuestions = await getFollowUpQuestions(
              messages.slice(0, -1),
              latestMessage.message
            );
            setFollowUpQuestions(followUpQuestions);

            // Get and set user intent
            const intent = await getUserIntent(
              messages.slice(0, -1),
              latestMessage.message
            );
            setUserIntent(intent);
          }
        }
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
      const grouped = citedSources.reduce((acc, source) => {
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
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error) {
      console.error("Error fetching document:", error);
      return;
    }

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

  return (
    <div className="flex flex-col h-screen">
      {/* Research Summary */}
      <Card className="mb-4 mx-4 mt-4">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{projectTitle}</h2>
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
        </CardContent>
      </Card>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-3/4 p-4 flex flex-col">
          {/* Intent and Follow-up Questions */}
          <div className="flex mb-4 space-x-4">
            {/* User Intent */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>User Intent</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{userIntent}</p>
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
              <PineconeMetadataFilterSelect
                options={congressSessions}
                filterKey="congress"
                placeholder="Select Congress"
                isNumeric={true}
              />
              <PineconeMetadataFilterSelect
                options={topics}
                filterKey="policyArea"
                placeholder="Select Topic"
              />
              <PineconeMetadataFilterSelect
                filterKey="topK"
                isNumeric={true}
                isSlider={true}
                min={4}
                max={30}
              />
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
                {showingSources
                  ? Object.values(groupedSources).map((source: any) => (
                      <Card key={source.id} className="mb-4">
                        <CardContent className="p-4">
                          <h3 className="font-semibold">
                            {truncateTitle(source.title)}
                          </h3>
                          <p className="text-sm">Congress: {source.congress}</p>
                          <p className="text-sm">
                            Policy Area: {source.policyArea}
                          </p>
                          <p className="text-sm">
                            Excerpts: {source.chunks.length}
                          </p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Original Cited Sources
                                </DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-md overflow-auto max-h-[60vh]">
                                  {JSON.stringify(citedSources, null, 2)}
                                </pre>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <div className="mt-2">
                            {source.chunks.map(
                              (chunk: string, index: number) => (
                                <Tooltip
                                  key={index}
                                  content={
                                    <div className="max-w-md whitespace-normal">
                                      {chunk}
                                    </div>
                                  }
                                >
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mr-2 mt-2"
                                        onClick={() =>
                                          handleDocumentClick(source.id)
                                        }
                                      >
                                        Excerpt {index + 1}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                      <DialogHeader>
                                        <DialogTitle className="text-xl font-semibold">
                                          {source.title}
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="mt-4 flex">
                                        <div className="w-1/2 pr-4">
                                          <h4 className="font-semibold mb-2">
                                            Document Details
                                          </h4>
                                          {selectedDocument && (
                                            <>
                                              <p className="text-sm">
                                                {" "}
                                                Congress:{" "}
                                                {selectedDocument.congress}
                                              </p>
                                              <p className="text-sm">
                                                Policy Area:{" "}
                                                {selectedDocument.policyArea}
                                              </p>
                                              {/* Add more document details as needed */}
                                            </>
                                          )}
                                        </div>
                                        <div className="w-1/2 pl-4">
                                          <h4 className="font-semibold mb-2">
                                            Excerpt
                                          </h4>
                                          <p className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                                            {source.chunks[currentExcerptIndex]}
                                          </p>
                                          {source.chunks.length > 1 && (
                                            <div className="flex justify-between mt-4">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  handleExcerptNavigation(
                                                    "prev"
                                                  )
                                                }
                                              >
                                                <ChevronLeft className="h-4 w-4 mr-2" />
                                                Previous
                                              </Button>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  handleExcerptNavigation(
                                                    "next"
                                                  )
                                                }
                                              >
                                                Next
                                                <ChevronRight className="h-4 w-4 ml-2" />
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </Tooltip>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  : savedDocuments.map((doc) => (
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
        </div>
      </div>
    </div>
  );
};

export default ResearchProject;

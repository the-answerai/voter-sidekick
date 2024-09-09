"use client";
import React, { useState, useEffect } from "react";
import ChatFullPage from "./ChatFullPage";
import { useChatContext } from "../contexts/ChatContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import PineconeMetadataFilterSelect from "./PineconeMetadataFilterSelect";
import {
  congressSessions,
  initializeTopics,
} from "../chatbots/config/chatflowConfig";

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

  useEffect(() => {
    const loadTopics = async () => {
      const topicsMap = await initializeTopics();
      setTopics(topicsMap);
    };
    loadTopics();
  }, []);

  useEffect(() => {
    if (chatProps?.observersConfig?.observeMessages) {
      console.log("chatProps", chatProps);
      const originalObserveMessages = chatProps.observersConfig.observeMessages;
      chatProps.observersConfig.observeMessages = (messages) => {
        originalObserveMessages(messages);
        if (messages.length === 1) {
          clearSourceDocuments();
          setCitedSources([]);
          setShowingSources(false);
        } else {
          const latestMessage = messages[messages.length - 1];
          if (
            latestMessage.type === "apiMessage" &&
            latestMessage.sourceDocuments
          ) {
            addSourceDocuments(latestMessage.sourceDocuments);
            console.log(
              "latestMessage.sourceDocuments",
              latestMessage.sourceDocuments
            );
            const newCitedSources = latestMessage.sourceDocuments.map(
              (doc) => ({
                id: doc.metadata.id,
                title: doc.metadata.title || "Unknown Title",
                chunks: [doc.pageContent],
              })
            );
            setCitedSources(newCitedSources);
            setShowingSources(true);
          }
        }
      };
    }
  }, [chatProps, addSourceDocuments, clearSourceDocuments]);

  const handleSourceClick = (sourceUrl: string) => {
    // In a real app, you would fetch the actual cited sources based on the URL
    setCitedSources([
      {
        id: "s1",
        title: "IPCC Report 2021",
        chunks: ["Chapter 1: Overview", "Chapter 2: Climate Models"],
      },
      {
        id: "s2",
        title: "EPA Climate Action Plan",
        chunks: ["Section 1: Goals", "Section 2: Implementation"],
      },
    ]);
    setShowingSources(true);
  };

  const handleSaveDocument = (
    documentId: string,
    chunk: string | null = null
  ) => {
    // In a real app, you would implement the logic to save the document or chunk
    console.log(
      `Saving ${chunk ? "chunk from" : "entire"} document ${documentId}`
    );
    // For this example, we'll just add a new document to the savedDocuments array
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

  return (
    <div className="flex h-screen">
      <div className="w-3/4 p-4">
        {chatProps && <ChatFullPage {...chatProps} className="w-full h-full" />}
      </div>
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Research Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <span>Documents Reviewed: {sourceDocuments.length}</span>
              <span>Key Excerpts: {sourceDocuments.length * 2}</span>
              <span>Overall Relevance: 85%</span>
            </div>
            <Progress value={sourceDocuments.length * 10} className="mb-2" />
            <p className="text-sm">
              {sourceDocuments.length} of 10 recommended documents added
            </p>
            <div className="mt-4">
              <PineconeMetadataFilterSelect
                options={congressSessions}
                filterKey="congressSession"
                placeholder="Select Congress"
              />
              <PineconeMetadataFilterSelect
                options={topics}
                filterKey="topic"
                placeholder="Select Topic"
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
              {showingSources
                ? citedSources.map((source: any, index: number) => (
                    <Collapsible key={`${source.id}-${index}`} className="mb-4">
                      <CollapsibleTrigger className="flex items-center w-full">
                        <ChevronRight className="h-4 w-4 mr-2" />
                        {source.title}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {source.chunks.map((chunk, index) => (
                          <div key={index} className="ml-6 mt-2">
                            <p>{chunk}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-1"
                              onClick={() =>
                                handleSaveDocument(source.id, chunk)
                              }
                            >
                              Save Chunk
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-6 mt-2"
                          onClick={() => handleSaveDocument(source.id)}
                        >
                          Save Entire Document
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                : savedDocuments.map((doc) => (
                    <div key={doc.id} className="mb-4 p-3 border rounded-lg">
                      <h3 className="font-semibold">{doc.title}</h3>
                      <p className="text-sm">Date: {doc.date}</p>
                      <p className="text-sm">Authors: {doc.authors}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                        {doc.status}
                      </span>
                    </div>
                  ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResearchProject;

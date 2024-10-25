import { useState, useEffect } from "react";
import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardSubTitle,
} from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  // Bookmark,

  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

import getFollowUpQuestions from "@/utils/getFollwUpQuestions";
import { formatText } from "@/utils/formatText";
import { truncateTitle } from "@/utils/truncateTitle";
import { uncamelCaseAndTitleCase } from "@/utils/uncamelCaseAndTitleCase";

interface Excerpt {
  id: string;
  text: string;
  page: number;
  suggestedQuestions: string[];
}

interface Document {
  id: string;
  title: string;
  author: string;
  date: string;
  isValid: boolean;
  relevance: number;
  chunks?: string[];
  pdfUrl?: string;
  sourceUrl?: string;
  url?: string;
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
}

interface DocumentCardProps {
  document: Document;
  researchProject: ResearchProject;
  onDocumentClick: (documentId: string) => void;
  onSaveExcerpt?: (excerpt: string) => void;
  isSaved?: boolean;
  onRemoveExcerpt?: (excerptId: string) => void;
  customIcon?: React.ReactNode;
  customButtonText?: string;
}

const formatValue = (value: any) => {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "string") {
    // Check if the string is a valid date
    const date = new Date(value);
    if (!isNaN(date.getTime()) && value.length >= 10) {
      return date.toLocaleDateString(); // Returns YYYY-MM-DD
    }

    // Check if the string is a URL
    try {
      const url = new URL(value);
      return (
        <a href={url.href} target="_blank" rel="noopener noreferrer">
          {url.href}
        </a>
      );
    } catch (_) {
      // Not a valid URL
    }
    // Check if the string starts with an HTML tag
    if (value.trim().startsWith("<")) {
      return (
        <div className="p-4" dangerouslySetInnerHTML={{ __html: value }} />
      );
    }
  }

  return String(value).replace(/,(?!\s)/g, ", ");
};

// Helper function to render metadata fields
const renderMetadata = (source: any, showAll?: boolean) => {
  const excludeFields = ["id", "chunks", "title"];
  const metadataEntries = Object.entries(source).filter(
    ([key, value]) =>
      !excludeFields.includes(key) && value !== undefined && value !== null
  );

  const slideCount = !!showAll ? 100 : 5;

  const visibleMetadata = metadataEntries.slice(0, slideCount);
  if (!visibleMetadata.length) return null;

  return (
    <div className="flex flex-col space-y-1">
      {visibleMetadata.map(([key, value]) => (
        <p key={key} className="text-xs text-gray-600">
          <strong>{uncamelCaseAndTitleCase(key)}:</strong> {formatValue(value)}
        </p>
      ))}
    </div>
  );
};

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  researchProject,
  onDocumentClick,
  // onSaveExcerpt,
  isSaved = false,
  // onRemoveExcerpt,
}) => {
  const [currentExcerptIndex, setCurrentExcerptIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestedQuestions = async () => {
      const excerpt = document?.chunks?.[currentExcerptIndex];

      const chatHistory = [
        {
          role: "system",
          content: `Research Project: ${researchProject.title}\nDescription: ${researchProject.description}`,
        },
        { role: "user", content: excerpt }, // Use excerpt.text
      ];

      if (!!excerpt) {
        const questions = await getFollowUpQuestions(chatHistory, excerpt);
        setSuggestedQuestions(questions);
      } else {
        setSuggestedQuestions([]);
      }
    };

    if (!isDialogOpen || !currentExcerptIndex || !document?.chunks?.length) {
      return;
    }

    fetchSuggestedQuestions();
  }, [isDialogOpen, currentExcerptIndex, document, researchProject]);

  const nextExcerpt = () => {
    if (document?.chunks && currentExcerptIndex < document.chunks.length - 1) {
      setCurrentExcerptIndex(currentExcerptIndex + 1);
    }
  };

  const prevExcerpt = () => {
    if (currentExcerptIndex > 0) {
      setCurrentExcerptIndex(currentExcerptIndex - 1);
    }
  };

  // const handleSaveOrRemove = () => {
  //   if (
  //     !document?.chunks?.length ||
  //     !currentExcerptIndex ||
  //     !document?.chunks?.[currentExcerptIndex]
  //   ) {
  //     return;
  //   }

  //   if (isSaved && onRemoveExcerpt) {
  //     onRemoveExcerpt(document.chunks[currentExcerptIndex].id);
  //   } else if (!isSaved && onSaveExcerpt) {
  //     onSaveExcerpt(document.chunks[currentExcerptIndex].text);
  //   }
  // };

  return (
    <>
      <Card key={document.id} className="mb-2 p-2">
        <CardHeader>
          <p className="font-semibold text-xs mb-2">
            {truncateTitle(document.title)}
          </p>
          {renderMetadata(document)}
        </CardHeader>

        <CardContent>
          <div className="mt-2 flex space-x-1 items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    onDocumentClick(document.id);
                  }}
                >
                  View Excerpts
                </Button>
              </DialogTrigger>

              <DialogContent className="h-full sm:max-w-[90vw] max-h-[90vh] overflow-auto flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex align-center h-auto min-h-auto">
                    <div className="self-center">{document.title}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `${document.url}#page=5`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="flex-shrink self-top text-blue-500  hover:text-blue-700"
                    >
                      <ExternalLink size="18" />
                    </Button>
                  </DialogTitle>
                </DialogHeader>

                <div className="bg-white h-full">
                  <div className="flex space-x-4 justify-between h-full">
                    {!document.sourceUrl && (
                      <div className="w-3/5 flex-grow">
                        <iframe
                          // src={`${document.sourceUrl}#page=5`}
                          src="https://static.project2025.org/2025_MandateForLeadership_FULL.pdf#page=2"
                          className="w-full h-full flex-grow"
                          title={document.title}
                          style={{ height: "100%" }} // Ensure iframe is 100% height
                        />
                      </div>
                    )}
                    <div className="p-4 bg-gray-100 h-full rounded-md w-2/5">
                      <Tabs className="w-full" defaultValue="excerpts">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger
                            value="excerpts"
                            className="text-xs data-[state=inactive]:text-gray-500"
                          >
                            Excerpts
                          </TabsTrigger>
                          <TabsTrigger
                            value="info"
                            className="text-xs data-[state=inactive]:text-gray-500"
                          >
                            Document Info
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="excerpts">
                          <div className="carousel">
                            <div className="flex flex-col">
                              <Card>
                                <CardHeader className="flex flex-row justify-between mb-2">
                                  <CardSubTitle className="font-semibold">
                                    Excerpt #{currentExcerptIndex + 1}
                                  </CardSubTitle>

                                  <div>
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      onClick={prevExcerpt}
                                      disabled={currentExcerptIndex === 0}
                                      className="ml-auto "
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      onClick={nextExcerpt}
                                      disabled={
                                        !document?.chunks?.length ||
                                        currentExcerptIndex ===
                                          document?.chunks?.length - 1
                                      }
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </Button>

                                    {/* <Button
                                      variant="outline"
                                      size="xs"
                                      onClick={onSaveExcerpt}
                                      disabled={
                                        currentExcerptIndex ===
                                        document?.chunks.length - 1
                                      }
                                    >
                                      <Bookmark className="w-4 h-4" />
                                    </Button> */}
                                  </div>
                                </CardHeader>

                                <CardContent>
                                  {!!currentExcerptIndex &&
                                    !!document?.chunks?.[
                                      currentExcerptIndex
                                    ] && (
                                      <pre className="text-sm whitespace-pre-wrap font-sans">
                                        {formatText(
                                          document?.chunks?.[
                                            currentExcerptIndex
                                          ]
                                        )}
                                      </pre>
                                    )}
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="info">
                          {renderMetadata(document, true)}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DocumentCard;

import { useState, useEffect } from "react";
import React from "react";
import { useProjectContext } from "@/contexts/ProjectContext";

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

import getFollowUpQuestions from "@/utils/getFollowUpQuestions";
import { formatText } from "@/utils/formatText";
import { truncateTitle } from "@/utils/truncateTitle";
import { uncamelCaseAndTitleCase } from "@/utils/uncamelCaseAndTitleCase";

import type { Document, Message } from "@/types";

interface DocumentCardProps {
  document: Document;
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

    // Check for dates in the format "D:20240727122813-04'00'"
    const dateMatch = value.match(
      /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
    );
    if (dateMatch) {
      const [_, year, month, day, hour, minute, second] = dateMatch;
      const formattedDate = new Date(
        Date.UTC(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
          parseInt(second)
        )
      );
      return formattedDate.toLocaleDateString(); // Adjust as needed for your locale
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
  if (!source) return null;

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
        <p key={key} id={key} className="text-xs text-gray-600">
          <strong>{uncamelCaseAndTitleCase(key)}:</strong> {formatValue(value)}
        </p>
      ))}
    </div>
  );
};

const constructDocumentUrl = (baseUrl: string, pageNumber?: string) => {
  try {
    const url = new URL(baseUrl);
    const hash = `#page=${pageNumber}`;
    const queryString = url.search; // Preserve existing query string
    url.search = ""; // Clear the search to append hash first
    url.hash = hash; // Append the hash
    url.search = queryString; // Re-append the query string if it exists
    return url.toString();
  } catch (error) {
    console.error("Invalid URL:", error);
    return baseUrl;
  }
};

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const {
    projectDetails,
    currentDocument,
    setCurrentDocument,
    currentExcerptIndex,
    setCurrentExcerptIndex,
  } = useProjectContext();

  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState(
    document?.chunks?.[currentExcerptIndex]?.pageNumber || "1"
  );

  const [documentUrl, setDocumentUrl] = useState(
    constructDocumentUrl(document.sourceUrl || "", pageNumber)
  );

  useEffect(() => {
    setDocumentUrl(constructDocumentUrl(document.sourceUrl || "", pageNumber));
  }, [pageNumber, document.sourceUrl]);

  useEffect(() => {
    const fetchSuggestedQuestions = async () => {
      if (!currentDocument) return;

      const excerpt = currentDocument.chunks?.[currentExcerptIndex];

      if (!!excerpt?.text) {
        const chatHistory: Message[] = [
          {
            role: "system",
            content: `Research Project: ${projectDetails?.title}\nDescription: ${projectDetails?.description}`,
          },
          { role: "user", content: excerpt.text },
        ];

        const questions = await getFollowUpQuestions(chatHistory, excerpt.text);
        setSuggestedQuestions(questions || []);
      } else {
        setSuggestedQuestions([]);
      }
    };

    if (
      !projectDetails ||
      !isDialogOpen ||
      !currentExcerptIndex ||
      !currentDocument?.chunks?.length
    ) {
      return;
    }

    fetchSuggestedQuestions();
  }, [isDialogOpen, currentExcerptIndex, currentDocument, projectDetails]);

  useEffect(() => {
    if (
      !currentDocument?.chunks?.length ||
      !currentExcerptIndex ||
      currentDocument?.chunks?.length <= currentExcerptIndex
    ) {
      return;
    }

    const pageNumber = currentDocument.chunks[currentExcerptIndex]?.pageNumber;
    if (pageNumber) setPageNumber(pageNumber);
  }, [currentExcerptIndex, currentDocument]);

  const nextExcerpt = () => {
    if (!currentDocument?.chunks) return;

    if (currentExcerptIndex < currentDocument.chunks.length - 1) {
      setCurrentExcerptIndex(currentExcerptIndex + 1);
    }
  };

  const prevExcerpt = () => {
    if (currentExcerptIndex > 0) {
      setCurrentExcerptIndex(currentExcerptIndex - 1);
    }
  };

  const handleDocumentClick = () => {
    setCurrentDocument(document);
    setCurrentExcerptIndex(0);
  };

  return (
    <>
      <Card key={document.id} className="mb-2 p-2">
        <CardHeader>
          <p className="font-semibold text-xs mb-2">
            {truncateTitle(document.title)}
          </p>
          <div className="hidden xl:block">{renderMetadata(document)}</div>
        </CardHeader>

        <CardContent>
          <div className="mt-2 flex space-x-1 items-center">
            <Dialog
              open={!!currentDocument && currentExcerptIndex !== -1}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setCurrentDocument(null);
                  setCurrentExcerptIndex(-1);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleDocumentClick}
                >
                  View <span className="hidden xl:inline">&nbsp;Excerpts</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="h-full sm:max-w-[90vw] max-h-[90vh] overflow-auto flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex align-center h-auto min-h-auto">
                    <div className="self-center">{document.title} here</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `${documentUrl}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="flex-shrink py-0 min-h-auto text-blue-500  hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </DialogTitle>
                </DialogHeader>

                <div className="bg-white h-full">
                  <div className="flex space-x-4 justify-between h-full">
                    {documentUrl && (
                      <div className="w-3/5 flex-grow">
                        <iframe
                          key={documentUrl}
                          src={documentUrl}
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
                                        !currentDocument?.chunks?.length ||
                                        currentExcerptIndex ===
                                          currentDocument?.chunks?.length - 1
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
                                        currentDocument?.chunks.length - 1
                                      }
                                    >
                                      <Bookmark className="w-4 h-4" />
                                    </Button> */}
                                  </div>
                                </CardHeader>

                                <CardContent>
                                  {!!currentExcerptIndex &&
                                    !!currentDocument?.chunks?.[
                                      currentExcerptIndex
                                    ] && (
                                      <pre className="text-sm whitespace-pre-wrap font-sans">
                                        {formatText(
                                          currentDocument?.chunks?.[
                                            currentExcerptIndex
                                          ]?.text
                                        )}
                                      </pre>
                                    )}
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="info">
                          {renderMetadata(currentDocument, true)}
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

import React from "react";
import { CitedSource } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, MoreHorizontal } from "lucide-react";

interface SourceDocumentsSidebarProps {
  groupedSources: Record<string, CitedSource & { chunks: string[] }>;
  handleDocumentClick: (documentId: string) => void;
  selectedDocument: any;
  currentExcerptIndex: number;
  handleExcerptNavigation: (direction: "prev" | "next") => void;
  handleSaveExcerpt: (sourceId: string, chunk: string) => void; // New prop
}

const truncateTitle = (title: string, maxLength: number = 75) => {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength) + "...";
};

// Helper function to uncamel case and titlecase a string
const uncamelCaseAndTitleCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space between camel case words
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};

// Helper function to format values
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

const SourceDocumentsSidebar: React.FC<SourceDocumentsSidebarProps> = ({
  groupedSources,
  handleDocumentClick,
  selectedDocument,
  currentExcerptIndex,
  handleExcerptNavigation,
  handleSaveExcerpt, // Destructure the new prop
}) => {
  const [selectedExcerpt, setSelectedExcerpt] = React.useState<{
    sourceId: string;
    index: number;
  } | null>(null);

  // Helper function to format the text while preserving newlines
  const formatText = (text: string) => {
    return text.replace(/\\n/g, "\n").replace(/\\"/g, '"').trim();
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

    // const hiddenMetadata = metadataEntries.slice(slideCount);

    return (
      <div className="flex flex-col space-y-1">
        {visibleMetadata.map(([key, value]) => (
          <p key={key} className="text-xs text-gray-600">
            <strong>{uncamelCaseAndTitleCase(key)}:</strong>{" "}
            {formatValue(value)}
          </p>
        ))}

        {/* {!!hiddenMetadata?.length && (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 mr-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white p-2 rounded-md shadow-md border border-gray-200">
                {hiddenMetadata.map(([key, value]) => (
                  <p key={key} className="text-xs">
                    <strong>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </strong>{" "}
                    {String(value)}
                  </p>
                ))}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )} */}
      </div>
    );
  };

  // const numDocuments = Object.keys(groupedSources).length;

  return (
    <ScrollArea className="h-full">
      {Object.values(groupedSources).map((source: any) => (
        <Card key={source.id} className="mb-2 p-2">
          <CardHeader>
            <p className="font-semibold text-xs mb-2">
              {truncateTitle(source.title)}
            </p>
            {renderMetadata(source)}
          </CardHeader>

          <CardContent>
            <div className="mt-2 flex space-x-1 items-center">
              <div className="text-xs font-semibold">Excerpts: </div>

              {source.chunks.map((chunk: string, index: number) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => {
                              handleDocumentClick(source.id);
                              setSelectedExcerpt({
                                sourceId: source.id,
                                index,
                              });
                            }}
                          >
                            {index + 1}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-auto flex flex-col">
                          <DialogHeader>
                            <DialogTitle>Excerpt {index + 1}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 bg-white p-4 rounded-md flex-grow overflow-auto">
                            <h4 className="font-semibold mb-2">
                              {source.title}
                            </h4>
                            <div className="flex space-x-4">
                              <div className="p-4 bg-gray-100 flex-1 rounded-md">
                                <ScrollArea className="h-100">
                                  <pre className="text-sm whitespace-pre-wrap font-sans">
                                    {formatText(chunk)}
                                  </pre>
                                </ScrollArea>
                              </div>
                              <div className="p-4 bg-gray-100 flex-1 rounded-md">
                                {renderMetadata(source, true)}
                              </div>
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleSaveExcerpt(source.id, chunk)
                              }
                            >
                              Save Excerpt
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-md whitespace-pre-wrap">
                        {formatText(chunk)}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="xs">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-auto flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Original Cited Sources</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 flex-grow overflow-auto">
                    <ScrollArea className="h-full">
                      <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-md">
                        {JSON.stringify(source, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
};

export default SourceDocumentsSidebar;

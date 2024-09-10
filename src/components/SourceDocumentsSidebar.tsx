import React, { useState } from "react";
import { CitedSource } from "../types";
import { Card, CardContent } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, MoreHorizontal } from "lucide-react";

interface SourceDocumentsSidebarProps {
  groupedSources: Record<string, CitedSource & { chunks: string[] }>;
  handleDocumentClick: (documentId: string) => void;
  selectedDocument: any;
  currentExcerptIndex: number;
  handleExcerptNavigation: (direction: "prev" | "next") => void;
}

const truncateTitle = (title: string, maxLength: number = 75) => {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength) + "...";
};

const SourceDocumentsSidebar: React.FC<SourceDocumentsSidebarProps> = ({
  groupedSources,
  handleDocumentClick,
  selectedDocument,
  currentExcerptIndex,
  handleExcerptNavigation,
}) => {
  const [selectedExcerpt, setSelectedExcerpt] = useState<{
    sourceId: string;
    index: number;
  } | null>(null);

  // Helper function to format the text while preserving newlines
  const formatText = (text: string) => {
    return text.replace(/\\n/g, "\n").replace(/\\"/g, '"').trim();
  };

  // Helper function to render metadata fields
  const renderMetadata = (source: any) => {
    const excludeFields = ["id", "chunks", "title"];
    const metadataEntries = Object.entries(source).filter(
      ([key, value]) =>
        !excludeFields.includes(key) && value !== undefined && value !== null
    );

    const visibleMetadata = metadataEntries.slice(0, 5);
    const hiddenMetadata = metadataEntries.slice(5);

    return (
      <>
        {visibleMetadata.map(([key, value]) => (
          <p key={key} className="text-sm">
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
            {String(value)}
          </p>
        ))}
        {hiddenMetadata.length > 0 && (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white p-2 rounded-md shadow-md border border-gray-200">
                {hiddenMetadata.map(([key, value]) => (
                  <p key={key} className="text-sm">
                    <strong>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </strong>{" "}
                    {String(value)}
                  </p>
                ))}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </>
    );
  };

  return (
    <Card className="flex-1">
      <ScrollArea className="h-[calc(100vh-350px)]">
        {Object.values(groupedSources).map((source: any) => (
          <Card key={source.id} className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold">{truncateTitle(source.title)}</h3>
              {renderMetadata(source)}
              <p className="text-sm">Excerpts: {source.chunks.length}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Original Cited Sources</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 flex-grow overflow-hidden">
                    <ScrollArea className="h-full">
                      <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-md">
                        {JSON.stringify(source, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="mt-2">
                {source.chunks.map((chunk: string, index: number) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mr-2 mt-2"
                              onClick={() => {
                                handleDocumentClick(source.id);
                                setSelectedExcerpt({
                                  sourceId: source.id,
                                  index,
                                });
                              }}
                            >
                              Excerpt {index + 1}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
                            <DialogHeader>
                              <DialogTitle>Excerpt {index + 1}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 bg-white p-4 rounded-md flex-grow overflow-hidden flex flex-col">
                              <h4 className="font-semibold mb-2">
                                {source.title}
                              </h4>
                              <div className="mb-4">
                                {renderMetadata(source)}
                              </div>
                              <div className="p-4 bg-gray-100 rounded-md">
                                <pre className="text-sm whitespace-pre-wrap font-sans">
                                  <ScrollArea className="flex-grow">
                                    {formatText(chunk)}
                                  </ScrollArea>
                                </pre>
                              </div>
                            </div>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </Card>
  );
};

export default SourceDocumentsSidebar;

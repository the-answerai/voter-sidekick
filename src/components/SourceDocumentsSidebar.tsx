import React, { useState, useMemo } from "react";
import { SourceDocument, CitedSource } from "../types";
import LinkIcon from "./Icons/LinkIcon";
import ExpandIcon from "./Icons/ExpandIcon";
import { formatDate } from "../utils/formatDate";
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
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";

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
  return (
    <Card className="flex-1">
      <ScrollArea className="h-[calc(100vh-350px)]">
        {Object.values(groupedSources).map((source: any) => (
          <Card key={source.id} className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold">{truncateTitle(source.title)}</h3>
              <p className="text-sm">Congress: {source.congress}</p>
              <p className="text-sm">Policy Area: {source.policyArea}</p>
              <p className="text-sm">Excerpts: {source.chunks.length}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Original Cited Sources</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-md overflow-auto max-h-[60vh]">
                      {JSON.stringify(source, null, 2)}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="mt-2">
                {source.chunks.map((chunk: string, index: number) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 mt-2"
                          onClick={() => handleDocumentClick(source.id)}
                        >
                          Excerpt {index + 1}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-md whitespace-normal">
                          {chunk}
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

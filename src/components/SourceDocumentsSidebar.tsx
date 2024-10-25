import React from "react";
import { CitedSource, ResearchProject } from "../types";

import { ScrollArea } from "@/components/ui/scroll-area";
import DocumentCard from "./ResearchProject/DocumentCard";

interface SourceDocumentsSidebarProps {
  groupedSources: Record<string, CitedSource & { chunks: string[] }>;
  handleDocumentClick: (documentId: string) => void;
  selectedDocument: any;
  currentExcerptIndex: number;
  handleExcerptNavigation: (direction: "prev" | "next") => void;
  handleSaveExcerpt: (sourceId: string, chunk: string) => void; // New prop
  researchProject?: ResearchProject;
}

const SourceDocumentsSidebar: React.FC<SourceDocumentsSidebarProps> = ({
  groupedSources,
  handleDocumentClick,
  // selectedDocument,
  // currentExcerptIndex,
  // handleExcerptNavigation,
  // handleSaveExcerpt, // Destructure the new prop
  researchProject, // Destructure the new prop
}) => {
  // const [selectedExcerpt, setSelectedExcerpt] = React.useState<{
  //   sourceId: string;
  //   index: number;
  // } | null>(null);

  return (
    <ScrollArea className="h-full">
      {Object.values(groupedSources).map((source: any) => (
        <DocumentCard
          key={source.id}
          document={source}
          researchProject={researchProject}
          onDocumentClick={handleDocumentClick}
          // onSaveExcerpt,
          // isSaved = false,
          // onRemoveExcerpt,
          // customIcon,
          // customButtonText,
        />
      ))}
    </ScrollArea>
  );
};

export default SourceDocumentsSidebar;

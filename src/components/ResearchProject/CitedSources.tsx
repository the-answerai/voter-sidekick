import React from "react";
import SourceDocumentsSidebar from "../SourceDocumentsSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResearchProject } from "@/types";
// import { getBill } from "@/utils/supabaseClient";

interface CitedSourcesProps {
  groupedSources: Record<string, any>;
  handleDocumentClick: (documentId: string) => void;
  selectedDocument: any;
  currentExcerptIndex: number;
  handleExcerptNavigation: (direction: "prev" | "next") => void;
  handleSaveExcerpt: (sourceId: string, chunk: string) => void;
  researchProject?: ResearchProject;
}

const CitedSources: React.FC<CitedSourcesProps> = ({
  groupedSources,
  handleDocumentClick,
  selectedDocument,
  currentExcerptIndex,
  handleExcerptNavigation,
  handleSaveExcerpt,
  researchProject,
}) => {
  return (
    <>
      {!!Object.keys(groupedSources)?.length ? (
        <ScrollArea className="h-[calc(100vh-350px)]">
          <SourceDocumentsSidebar
            groupedSources={groupedSources}
            handleDocumentClick={handleDocumentClick}
            selectedDocument={selectedDocument}
            currentExcerptIndex={currentExcerptIndex}
            handleExcerptNavigation={handleExcerptNavigation}
            handleSaveExcerpt={handleSaveExcerpt}
            researchProject={researchProject}
          />
        </ScrollArea>
      ) : (
        <div className="p-4 text-gray-500">
          <h4 className="font-semibold mb-4">No Cited Sources Yet</h4>
          <p className="text-xs">
            As you conduct your research, sources cited in your project will
            appear here. You&apos;ll be able to view and navigate through
            document excerpts, making it easy to reference and review your
            sources.
            <br />
            <br />
            To use: Click on a source to view its details and navigate through
            excerpts using the provided controls.
          </p>
        </div>
      )}
    </>
  );
};

export default CitedSources;

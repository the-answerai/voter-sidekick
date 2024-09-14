import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import SourceDocumentsSidebar from "../SourceDocumentsSidebar";
import { getBill } from "@/utils/supabaseClient";

interface CitedSourcesProps {
  groupedSources: Record<string, any>;
  handleDocumentClick: (documentId: string) => void;
  selectedDocument: any;
  currentExcerptIndex: number;
  handleExcerptNavigation: (direction: "prev" | "next") => void;
  handleSaveExcerpt: (sourceId: string, chunk: string) => void; // New prop
}

const CitedSources: React.FC<CitedSourcesProps> = ({
  groupedSources,
  handleDocumentClick,
  selectedDocument,
  currentExcerptIndex,
  handleExcerptNavigation,
  handleSaveExcerpt, // Destructure the new prop
}) => {
  const hasSourcesContent = Object.keys(groupedSources).length > 0;

  return (
    <Card className="flex-1">
      <CardContent>
        {hasSourcesContent ? (
          <SourceDocumentsSidebar
            groupedSources={groupedSources}
            handleDocumentClick={handleDocumentClick}
            selectedDocument={selectedDocument}
            currentExcerptIndex={currentExcerptIndex}
            handleExcerptNavigation={handleExcerptNavigation}
            handleSaveExcerpt={handleSaveExcerpt} // Pass it down
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            <h3 className="font-semibold mb-2">No Cited Sources Yet</h3>
            <p>
              As you conduct your research, sources cited in your project will
              appear here. You'll be able to view and navigate through document
              excerpts, making it easy to reference and review your sources.
            </p>
            <p className="mt-2">
              To use: Click on a source to view its details and navigate through
              excerpts using the provided controls.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CitedSources;

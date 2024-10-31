import React from "react";
import DocumentCard from "./DocumentCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectContext } from "@/contexts/ProjectContext";
import { getBill } from "@/utils/supabaseClient";
import { Excerpt } from "@/types";

const CitedSources: React.FC = () => {
  const {
    groupedSources,
    selectedDocument,
    setSelectedDocument,
    currentExcerptIndex,
    setCurrentExcerptIndex,
    projectDetails,
    updateProjectDetails,
  } = useProjectContext();

  const handleDocumentClick = async (documentId: string) => {
    const data = await getBill(documentId);
    setSelectedDocument(data);
    setCurrentExcerptIndex(0);
  };

  const handleSaveExcerpt = async (sourceId: string, chunk: string) => {
    if (!projectDetails) return;

    const excerpt: Excerpt = {
      sourceId,
      chunk,
      savedAt: new Date().toISOString(),
    };

    const exists = projectDetails.savedExcerpts.some(
      (ex: Excerpt) => ex?.sourceId === sourceId && ex?.chunk === chunk
    );

    if (!!exists) {
      alert("This excerpt is already saved.");
      return;
    }

    const updatedSavedExcerpts = [...projectDetails.savedExcerpts, excerpt];
    await updateProjectDetails({ savedExcerpts: updatedSavedExcerpts });
  };

  const handleExcerptNavigation = (direction: "prev" | "next") => {
    if (!selectedDocument) return;

    const totalExcerpts = groupedSources[selectedDocument.id].chunks.length;

    let newIndex = currentExcerptIndex;
    if (direction === "prev") {
      newIndex =
        currentExcerptIndex > 0 ? currentExcerptIndex - 1 : totalExcerpts - 1;
    } else {
      newIndex =
        currentExcerptIndex < totalExcerpts - 1 ? currentExcerptIndex + 1 : 0;
    }

    setCurrentExcerptIndex(newIndex);
  };

  return (
    <>
      {!!Object.keys(groupedSources)?.length ? (
        <ScrollArea className="xl:h-[calc(100vh-350px)]">
          {Object.values(groupedSources).map((source: any) => (
            <DocumentCard key={source.id} document={source} />
          ))}
        </ScrollArea>
      ) : (
        <div className="p-4 text-gray-500 hidden xl:block">
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

import React from "react";
import DocumentCard from "./DocumentCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectContext } from "@/contexts/ProjectContext";

const CitedSources: React.FC = () => {
  const { groupedSources } = useProjectContext();

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

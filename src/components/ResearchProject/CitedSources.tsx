import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DocumentCard from "./DocumentCard";

interface CitedSourcesProps {
  citedSources: any[];
  handleDocumentClick: (documentId: string) => void;
  handleSaveExcerpt: (sourceId: string, chunk: string) => void;
}

interface GroupedSource {
  id: string;
  title: string;
  author: string;
  date: string;
  isValid: boolean;
  relevance: number;
  excerpts: { text: string; page: number }[];
  pdfUrl: string;
}

const CitedSources: React.FC<CitedSourcesProps> = ({
  citedSources,
  handleDocumentClick,
  handleSaveExcerpt,
}) => {
  const [groupedSources, setGroupedSources] = useState<GroupedSource[]>([]);

  useEffect(() => {
    const grouped = citedSources.reduce<Record<string, GroupedSource>>(
      (acc, source) => {
        if (!acc[source.id]) {
          acc[source.id] = {
            id: source.id,
            title: source.title || "Untitled",
            author: source.author || "Unknown",
            date: source.date || "No date",
            isValid: source.isValid !== false,
            relevance: source.relevance || 0,
            excerpts: [],
            pdfUrl: source.pdfUrl || "",
          };
        }
        acc[source.id].excerpts.push(
          ...(source.chunks || []).map((chunk: string) => ({
            text: chunk,
            page: source.page || 0,
          }))
        );
        return acc;
      },
      {}
    );

    setGroupedSources(Object.values(grouped));
  }, [citedSources]);

  return (
    <Card className="flex-1">
      <CardContent>
        {groupedSources.length > 0 ? (
          groupedSources.map((source) => (
            <DocumentCard
              key={source.id}
              document={source}
              onDocumentClick={() => handleDocumentClick(source.id)}
              onSaveExcerpt={(excerpt) => handleSaveExcerpt(source.id, excerpt)}
            />
          ))
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

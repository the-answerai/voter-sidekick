import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface SavedExcerpt {
  sourceId: string;
  chunk: string;
  savedAt: string;
  documentName: string;
  validity: string;
  metadata?: {
    [key: string]: string;
  };
}

interface SavedDocumentsProps {
  savedExcerpts: SavedExcerpt[];
  onRemoveExcerpt: (excerpt: SavedExcerpt) => void;
}

const SavedDocuments: React.FC<SavedDocumentsProps> = ({
  savedExcerpts,
  onRemoveExcerpt,
}) => {
  const [expandedExcerpts, setExpandedExcerpts] = React.useState<Set<number>>(
    new Set()
  );

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedExcerpts);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedExcerpts(newExpanded);
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="space-y-4">
      {savedExcerpts.map((excerpt, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {excerpt.documentName}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="mb-2">
              <p className="text-sm">
                {expandedExcerpts.has(index)
                  ? excerpt.chunk
                  : truncateText(excerpt.chunk, 100)}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(index)}
                className="mt-1"
              >
                {expandedExcerpts.has(index) ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" /> Show More
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Validity: {excerpt.validity}</p>
              <p>Saved on: {new Date(excerpt.savedAt).toLocaleString()}</p>
              {excerpt.metadata &&
                Object.entries(excerpt.metadata).map(([key, value]) => (
                  <p key={key}>{`${key}: ${value}`}</p>
                ))}
            </div>
            <div className="mt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveExcerpt(excerpt)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SavedDocuments;

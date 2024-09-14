import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedDocumentsProps {
  savedExcerpts: any[];
}

const SavedDocuments: React.FC<SavedDocumentsProps> = ({ savedExcerpts }) => {
  return (
    <Card className="flex-1">
      <CardContent>
        {savedExcerpts?.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-350px)]">
            {savedExcerpts.map((excerpt, index) => (
              <div key={index} className="mb-4 p-2 border-b">
                <h4 className="font-semibold">Excerpt {index + 1}</h4>
                <p className="text-sm">Source ID: {excerpt.sourceId}</p>
                <div className="mt-2 p-2 bg-gray-100 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap font-sans">
                    {excerpt.chunk}
                  </pre>
                </div>
              </div>
            ))}
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <h3 className="font-semibold mb-2">No Saved Documents</h3>
            <p>
              Documents you save during your research will appear here. This
              allows you to keep track of important sources and easily access
              them later.
            </p>
            <p className="mt-2">
              To use: Save documents you find relevant to your research. You can
              review and manage your saved documents from this panel.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedDocuments;

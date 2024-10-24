import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedDocumentsProps {
  savedExcerpts: any[];
}

const SavedDocuments: React.FC<SavedDocumentsProps> = ({ savedExcerpts }) => {
  const excerpts = savedExcerpts.filter((se) => !!se.chunk);

  return (
    <>
      {!!excerpts?.length ? (
        <ScrollArea className="h-[calc(100vh-350px)]">
          {excerpts.map((excerpt, index) => (
            <Card className="flex-1 mb-2" key={index}>
              <CardHeader className="mb-2">
                <p className="font-semibold text-sm">Excerpt {index + 1}</p>
                {!!excerpt.sourceId && (
                  <p className="font-semibold text-xs">
                    Source ID: {excerpt.sourceId}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-md">
                  <pre className="text-xs whitespace-pre-wrap font-sans">
                    {excerpt.chunk
                      .split("\\n")
                      .map(
                        (line: string, index: React.Key | null | undefined) => (
                          <React.Fragment key={index}>
                            <br />
                            {line.replace(/\s+/g, " ")}
                          </React.Fragment>
                        )
                      )}
                  </pre>
                </div>
                {/* </div> */}
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      ) : (
        <div className="p-4 text-gray-500">
          <h4 className="font-semibold mb-4">No Saved Documents</h4>
          <p className="text-xs">
            Documents you save during your research will appear here. This
            allows you to keep track of important sources and easily access them
            later.
            <br />
            <br />
            To use: Save documents you find relevant to your research. You can
            review and manage your saved documents from this panel.
          </p>
        </div>
      )}
    </>
  );
};

export default SavedDocuments;

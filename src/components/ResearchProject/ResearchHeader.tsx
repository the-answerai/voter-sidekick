import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ResearchHeaderProps {
  projectTitle: string;
  projectDescription: string;
  sourceDocuments: any[];
  savedDocuments: any[];
  handleEditClick: () => void;
}

const ResearchHeader: React.FC<ResearchHeaderProps> = ({
  projectTitle,
  projectDescription,
  sourceDocuments,
  savedDocuments,
  handleEditClick,
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">{projectTitle}</h2>
          <Button onClick={handleEditClick} size="sm">
            Edit
          </Button>
        </div>
        <p className="text-xs text-gray-500 mb-3">{projectDescription}</p>
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="text-gray-500">Docs Reviewed</p>
            <p className="font-semibold">{sourceDocuments.length}</p>
          </div>
          <div>
            <p className="text-gray-500">Docs Saved</p>
            <p className="font-semibold">{savedDocuments.length}</p>
          </div>
          <div>
            <p className="text-gray-500">Key Excerpts</p>
            <p className="font-semibold">{sourceDocuments.length * 2}</p>
          </div>
          <div>
            <p className="text-gray-500">Progress</p>
            <p className="font-semibold">85%</p>
          </div>
        </div>
        <Progress value={sourceDocuments.length * 10} className="w-full mb-1" />
        <p className="text-xs text-gray-500">
          {sourceDocuments.length} of 10 recommended documents added
        </p>
      </CardContent>
    </Card>
  );
};

export default ResearchHeader;

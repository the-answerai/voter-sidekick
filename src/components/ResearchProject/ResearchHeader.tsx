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
  createdAt: string;
  updatedAt: string;
}

const ResearchHeader: React.FC<ResearchHeaderProps> = ({
  projectTitle,
  projectDescription,
  sourceDocuments,
  savedDocuments,
  handleEditClick,
}) => {
  return (
    <Card className="mb-4 mx-4 mt-4">
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{projectTitle}</h2>
          <p className="text-sm text-gray-500">{projectDescription}</p>
        </div>
        <div className="flex space-x-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">Hello Reviewed</p>
            <p className="text-lg font-semibold">{sourceDocuments.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Documents Saved</p>
            <p className="text-lg font-semibold">{savedDocuments.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Key Excerpts</p>
            <p className="text-lg font-semibold">
              {sourceDocuments.length * 2}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Overall Progress</p>
            <p className="text-lg font-semibold">85%</p>
          </div>
        </div>
        <div className="ml-8 flex-shrink-0">
          <Progress value={sourceDocuments.length * 10} className="w-40" />
          <p className="text-sm mt-1">
            {sourceDocuments.length} of 10 recommended documents added
          </p>
        </div>
        <Button onClick={handleEditClick} className="ml-4">
          Edit Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResearchHeader;

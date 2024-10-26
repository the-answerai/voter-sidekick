import React from "react";
import {
  Card,
  // CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";

import { EditIcon } from "lucide-react";

// import type { SourceDocument } from "@/types";

interface ResearchHeaderProps {
  title: string;
  description?: string;
  handleEditClick: () => void;
  // sourceDocuments?: SourceDocument[];
}

const ResearchHeader: React.FC<ResearchHeaderProps> = ({
  title,
  description,
  // sourceDocuments,
  // savedDocuments,
  handleEditClick,
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              <div className="text-gray-500">{description}</div>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="xs"
            className="p-0"
            onClick={handleEditClick}
          >
            <EditIcon className="w-4 h-4 " />
          </Button>
        </div>
      </CardHeader>

      {/* <CardContent className="flex items-center justify-between py-4">
        <div className="flex space-x-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">Reviewed</p>
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
      </CardContent> */}
    </Card>
  );
};

export default ResearchHeader;

import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useProjectContext } from "@/contexts/ProjectContext";

interface ResearchHeaderProps {
  handleEditClick: () => void;
}

const ResearchHeader: React.FC<ResearchHeaderProps> = ({ handleEditClick }) => {
  const { projectDetails } = useProjectContext();

  if (!projectDetails) return null;

  return (
    <Card className="p-0 border-0 border-none">
      {!!projectDetails?.imageUrl && (
        <div className="hidden xl:block">
          <CardMedia src={projectDetails.imageUrl} alt={projectDetails.title} />
        </div>
      )}

      <CardHeader className="flex items-center justify-between">
        <div className="flex items-start justify-between w-full">
          <div></div>
        </div>
      </CardHeader>

      <CardTitle className="text-sm p-2">
        {projectDetails.title}{" "}
        <Button variant="outline" size="xs" className="p-0" asChild>
          <a
            href={projectDetails.mainSourceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </CardTitle>

      {!!projectDetails?.description && (
        <CardDescription className="hidden xl:block text-xs text-gray-500  p-2">
          {projectDetails.description}
        </CardDescription>
      )}
    </Card>
  );
};

export default ResearchHeader;

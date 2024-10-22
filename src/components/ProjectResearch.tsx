import React from "react";
import ResearchProject from "./ResearchProject/ProjectDetails";

interface ProjectResearchProps {
  projectId?: number;
}

const ProjectResearch: React.FC<ProjectResearchProps> = ({ projectId }) => {
  if (!projectId) {
    return <>You must pass in a project ID.</>;
  }

  return <ResearchProject projectId={projectId} />;
};

export default ProjectResearch;

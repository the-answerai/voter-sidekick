import React from "react";
import ResearchProject from "./ResearchProject";

interface ProjectResearchProps {
  projectId: number;
}

const ProjectResearch: React.FC<ProjectResearchProps> = ({ projectId }) => {
  return <ResearchProject projectId={projectId} />;
};

export default ProjectResearch;

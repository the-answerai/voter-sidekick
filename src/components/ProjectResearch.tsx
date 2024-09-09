import React from "react";
import ResearchProject from "./ResearchProject";

const ProjectResearch: React.FC = () => {
  // In a real application, you would get the projectId from the route or props
  const projectId = 1;

  return <ResearchProject projectId={projectId} />;
};

export default ProjectResearch;

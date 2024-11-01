import React from "react";
import ProjectCard from "@/components/ProjectCard";
import { useGlobalContext } from "@/contexts/GlobalContext";

const ProjectList: React.FC = () => {
  const { projects } = useGlobalContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;

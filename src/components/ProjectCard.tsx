import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={`/research-projects/${project.id}`}>
      <Card className="flex flex-col p-0 cursor-pointer">
        <div className="relative w-full h-48">
          <Image
            src={project.imageUrl || ""}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        <CardHeader className="my-2 mx-4">
          <CardTitle className="text-lg">{project.title}</CardTitle>
        </CardHeader>

        <CardContent className="my-2 mx-4">
          <p className="text-xs text-gray-500">{project.description}</p>
        </CardContent>

        <CardFooter className="justify-end my-2 mx-4 flex-grow">
          <Button variant="outline" size="xs">
            Do Your Research →
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;

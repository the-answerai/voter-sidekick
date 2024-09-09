import React from "react";
import Link from "next/link";

const mockProjects = [
  { id: 1, title: "Climate Change Policy Research" },
  { id: 2, title: "Healthcare Reform Analysis" },
  { id: 3, title: "Education System Evaluation" },
];

const Homepage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Research Projects</h1>
      <ul className="space-y-4">
        {mockProjects.map((project) => (
          <li key={project.id} className="bg-white shadow-md rounded-lg p-4">
            <Link href={`/research-projects/${project.id}`}>
              <span className="text-xl font-semibold text-blue-600 hover:underline">
                {project.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Homepage;

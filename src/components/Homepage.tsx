"use client";
import React from "react";
import ProjectList from "@/components/ProjectList";

const Homepage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col">
      <ProjectList />
    </div>
  );
};

export default Homepage;

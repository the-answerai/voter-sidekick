"use client";

import React from "react";
import Header from "@/components/Header";
import { GlobalProvider } from "@/contexts/GlobalContext";
import { ProjectProvider } from "@/contexts/ProjectContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <GlobalProvider>
      <ProjectProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className=" mx-auto px-4 py-8">{children}</main>
        </div>
      </ProjectProvider>
    </GlobalProvider>
  );
};

export default ClientLayout;

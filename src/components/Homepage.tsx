"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/utils/supabaseClient";

interface ResearchProject {
  id: number;
  title: string;
  description: string | null;
  chatflowid: string | null;
  hasFilters: boolean;
}

const Homepage: React.FC = () => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectChatflowId, setNewProjectChatflowId] = useState("");
  const [newProjectHasFilters, setNewProjectHasFilters] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchProjects();
    // Check if the user is an admin
    setIsAdmin(process.env.NEXT_PUBLIC_IS_ADMIN === "true");
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("ResearchProject").select("*");
    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
  };

  const handleCreateProject = async () => {
    try {
      const { data, error } = await supabase
        .from("ResearchProject")
        .insert([
          {
            title: newProjectTitle,
            description: newProjectDescription,
            chatflowid: newProjectChatflowId,
            hasFilters: newProjectHasFilters,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating project:", error);
        // You might want to show an error message to the user here
      } else {
        console.log("Project created successfully:", data);
        setNewProjectTitle("");
        setNewProjectDescription("");
        setNewProjectChatflowId("");
        setNewProjectHasFilters(false);
        fetchProjects();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-between items-center mb-6">
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                New Sidekick
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Sidekick</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    How to Create a New Sidekick:
                  </h3>

                  <div className="space-y-2">
                    <h4 className="font-medium">
                      1. Submit a Sidekick Request
                    </h4>
                    <p className="text-sm text-gray-600">
                      Fill out our project request form and we'll help set it up
                      for you.{" "}
                      <a
                        href="[YOUR_FORM_LINK]"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Submit request →
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">2. Create Your Own (Free)</h4>
                    <p className="text-sm text-gray-600">
                      Create your own AI chatflow at theanswer.ai - it's
                      completely free!{" "}
                      <a
                        href="https://theanswer.ai"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Create chatflow →
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">
                      3. Contribute to the Project
                    </h4>
                    <p className="text-sm text-gray-600">
                      This is an open-source project. You can contribute
                      directly to the codebase.{" "}
                      <a
                        href="[YOUR_GITHUB_LINK]"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on GitHub →
                      </a>
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">
                    Already have a chatflow? Add it here:
                  </h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Project Title"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Project Description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                    />
                    <Input
                      placeholder="Chatflow ID from theanswer.ai"
                      value={newProjectChatflowId}
                      onChange={(e) => setNewProjectChatflowId(e.target.value)}
                    />
                    <Button onClick={handleCreateProject}>
                      Create Project
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>
                <Link href={`/research-projects/${project.id}`}>
                  <span className="text-xl font-semibold text-blue-600 hover:underline">
                    {project.title}
                  </span>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{project.description}</p>
            </CardContent>

            {isAdmin && (
              <CardFooter>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Chatflow ID: {project.chatflowid || "Not set"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Has Filters: {project.hasFilters ? "Yes" : "No"}
                  </p>
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Homepage;

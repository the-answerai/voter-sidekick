"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { supabase } from "@/utils/supabaseClient";

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase client:", supabase);

interface ResearchProject {
  id: number;
  title: string;
  description: string | null;
}

const Homepage: React.FC = () => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  useEffect(() => {
    fetchProjects();
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
          { title: newProjectTitle, description: newProjectDescription },
        ])
        .select();

      if (error) {
        console.error("Error creating project:", error);
        // You might want to show an error message to the user here
      } else {
        console.log("Project created successfully:", data);
        setNewProjectTitle("");
        setNewProjectDescription("");
        fetchProjects();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Research Projects</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Research Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Research Project</DialogTitle>
            </DialogHeader>
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
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
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
              <p>{project.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Homepage;

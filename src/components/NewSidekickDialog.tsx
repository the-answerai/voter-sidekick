import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import { useGlobalContext } from "@/contexts/GlobalContext";

const NewSidekickDialog: React.FC = () => {
  const { fetchProjects } = useGlobalContext();
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectImageUrl, setNewProjectImageUrl] = useState("");
  const [newProjectChatflowId, setNewProjectChatflowId] = useState("");
  const [newProjectHasFilters, setNewProjectHasFilters] = useState(false);

  const handleCreateProject = async () => {
    try {
      const { data, error } = await supabase
        .from("ResearchProject")
        .insert([
          {
            title: newProjectTitle,
            description: newProjectDescription,
            imageUrl: newProjectImageUrl,
            chatflowid: newProjectChatflowId,
            hasFilters: newProjectHasFilters,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating project:", error);
      } else {
        setNewProjectTitle("");
        setNewProjectDescription("");
        setNewProjectImageUrl("");
        setNewProjectChatflowId("");
        setNewProjectHasFilters(false);
        await fetchProjects();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs">
          New Sidekick
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>How to Create a New Sidekick</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          {/* Submit Request Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                1. Submit a Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-600">
                Fill out our project request form and we&apos;ll help set it up
                for you.
              </p>
              <Button variant="outline" size="xs" className="w-full" asChild>
                <a
                  href="https://airtable.com/app7EPzlq7OvwUQP1/pagivGSTAmPKfw6q7/form"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Submit Request <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Create Own Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                2. Create Your Own
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-600">
                Create your own AI chatflow at theanswer.ai - it&apos;s
                completely free!
              </p>
              <Button variant="outline" size="xs" className="w-full" asChild>
                <a
                  href="https://theanswer.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create Chatflow <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Contribute Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                3. Contribute
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-600">
                This is an open-source project. You can contribute directly to
                the codebase.
              </p>
              <Button variant="outline" size="xs" className="w-full" asChild>
                <a
                  href="https://github.com/the-answerai/voter-sidekick"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Add Project Form */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Already have a chatflow? Add it here:
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <Button onClick={handleCreateProject} variant="outline">
              Create Project
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default NewSidekickDialog;

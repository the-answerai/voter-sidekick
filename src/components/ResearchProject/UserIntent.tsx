import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardSubTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader } from "lucide-react";
import getUserIntent from "@/utils/getUserIntentGoal";
import { useProjectContext } from "@/contexts/ProjectContext";

const UserIntent: React.FC = () => {
  const { projectDetails, updateProjectDetails, chatProps } =
    useProjectContext();
  const [isEditingIntent, setIsEditingIntent] = useState(false);
  const [editedIntent, setEditedIntent] = useState(
    projectDetails?.intent || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleIntentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedIntent(e.target.value);
  };

  const handleIntentBlur = async () => {
    setIsEditingIntent(false);
    if (editedIntent !== projectDetails?.intent) {
      await updateProjectDetails({ intent: editedIntent });
    }
  };

  const handleGenerateIntent = async () => {
    setIsLoading(true);
    try {
      const messages = chatProps?.messages || [];
      if (!messages?.length) throw new Error("No Messages Found");

      const latestMessage = messages[messages.length - 1];

      if (!latestMessage?.message)
        throw new Error("No message found in latest message");

      const intent = await getUserIntent(
        messages.slice(0, -1),
        latestMessage?.message
      );
      await updateProjectDetails({ intent });
      setEditedIntent(intent);
    } catch (error) {
      console.error("Error generating intent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardSubTitle className="flex text-center items-center justify-between">
          Goals
          <Button
            variant="ghost"
            size="sm"
            className="p-0"
            onClick={handleGenerateIntent}
            title="Generate new intent"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
          </Button>
        </CardSubTitle>
      </CardHeader>

      <CardContent>
        <Textarea
          value={editedIntent}
          onChange={handleIntentChange}
          onBlur={handleIntentBlur}
          className={`w-full text-sm bg-gray-100 border-none ${isEditingIntent ? "" : "hidden"}`}
        />
        <p className={`text-sm ${isEditingIntent ? "hidden" : ""}`}>
          <a
            onClick={(e) => {
              e.preventDefault();
              setIsEditingIntent(true);
            }}
          >
            {editedIntent || (
              <div className="text-center">Click to add user intent</div>
            )}
          </a>
        </p>
      </CardContent>
    </Card>
  );
};

export default UserIntent;

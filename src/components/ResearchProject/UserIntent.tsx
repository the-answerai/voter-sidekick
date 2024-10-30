import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardSubTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader } from "lucide-react";

interface UserIntentProps {
  userIntent: string;
  updateUserIntent: (intent: string) => Promise<void>;
  handleGenerateIntent: () => Promise<void>;
  messages: any[];
}

const UserIntent: React.FC<UserIntentProps> = ({
  userIntent,
  updateUserIntent,
  handleGenerateIntent,
  messages,
}) => {
  const [isEditingIntent, setIsEditingIntent] = useState(false);
  const [editedIntent, setEditedIntent] = useState(userIntent);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditedIntent(userIntent);
  }, [userIntent]);

  const handleIntentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedIntent(e.target.value);
  };

  const handleIntentBlur = async () => {
    setIsEditingIntent(false);
    if (editedIntent !== userIntent) {
      await updateUserIntent(editedIntent);
    }
  };

  const handleGenerateIntentClick = async () => {
    setIsLoading(true);
    await handleGenerateIntent();
    setIsLoading(false);
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
            onClick={handleGenerateIntentClick}
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

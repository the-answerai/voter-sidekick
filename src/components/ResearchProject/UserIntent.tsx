import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          User Intent
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateIntent}
            title="Generate new intent"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditingIntent ? (
          <Textarea
            value={editedIntent}
            onChange={handleIntentChange}
            onBlur={handleIntentBlur}
            className="w-full"
          />
        ) : (
          <p onClick={() => setIsEditingIntent(true)}>
            {editedIntent || "Click to add user intent"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserIntent;

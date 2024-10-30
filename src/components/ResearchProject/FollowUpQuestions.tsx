import React from "react";
import {
  Card,
  CardHeader,
  CardSubTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FollowUpQuestionsProps {
  followUpQuestions: string[];
  handleFollowUpQuestion: (question: string) => void;
}

const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({
  followUpQuestions,
  handleFollowUpQuestion,
}) => {
  if (!followUpQuestions?.length) return null;

  return (
    <Card>
      <CardHeader className="mb-4">
        <CardSubTitle>Suggested Follow-up Questions</CardSubTitle>
      </CardHeader>
      <CardContent className="flex  gap-2">
        {followUpQuestions.map((question, index) => (
          <Button
            key={index}
            size="xs"
            variant="outline"
            className="cursor-pointer text-left"
            onClick={() => handleFollowUpQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default FollowUpQuestions;

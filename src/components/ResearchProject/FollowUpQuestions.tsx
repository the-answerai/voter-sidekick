import React from "react";
import {
  Card,
  CardHeader,
  CardSubTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <CardHeader className="mb-2">
        <CardSubTitle>Suggested Follow-up Questions</CardSubTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {followUpQuestions.map((question, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => handleFollowUpQuestion(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowUpQuestions;

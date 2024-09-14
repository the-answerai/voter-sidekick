import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FollowUpQuestionsProps {
  followUpQuestions: string[];
  handleFollowUpQuestion: (question: string) => void;
}

const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({
  followUpQuestions,
  handleFollowUpQuestion,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Follow-up Questions</CardTitle>
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

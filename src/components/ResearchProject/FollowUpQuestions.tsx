import React from "react";
import {
  Card,
  CardHeader,
  CardSubTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { handleFollowUpQuestionLoading } from "@/utils/handleFollowUpQuestionLoading";
import { useProjectContext } from "@/contexts/ProjectContext";

import { handleFollowUpQuestion } from "@/utils/handleFollowUpQuestion";

const FollowUpQuestions: React.FC = () => {
  const { followUpQuestions, chatProps } = useProjectContext();

  const onClickHandler = (question: string) => {
    if (!handleFollowUpQuestion) return false;

    try {
      handleFollowUpQuestion(question, chatProps);
    } catch (error) {
      console.error("Error handling follow-up question:", error);
    }
  };

  if (!followUpQuestions?.length) return null;

  return (
    <Card>
      <CardHeader className="mb-4">
        <CardSubTitle>Suggested Follow-up Questions</CardSubTitle>
      </CardHeader>
      <CardContent className="flex flex-col 2xl:flex-row gap-2">
        {followUpQuestions.map((question, index) => (
          <Button
            key={index}
            size="xs"
            variant="outline"
            className="cursor-pointer text-left"
            onClick={() => onClickHandler(question)}
          >
            {question}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default FollowUpQuestions;

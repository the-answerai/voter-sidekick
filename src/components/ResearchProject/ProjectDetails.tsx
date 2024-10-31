"use client";
import React, { useEffect, useRef } from "react";
import { useProjectContext } from "@/contexts/ProjectContext";

import ChatFullPage from "../ChatFullPage";
import FollowUpQuestions from "./FollowUpQuestions";
import CitedSources from "./CitedSources";
import ResearchHeader from "./ResearchHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { handleFollowUpQuestion } from "@/utils/handleFollowUpQuestion";
import { VisibilityOptions } from "@/utils/supabaseClient";

const ResearchProject: React.FC<{ projectId: number }> = ({ projectId }) => {
  const {
    projectDetails,
    followUpQuestions,
    chatProps,
    isLoading,
    loadProjectDetails,
    updateProjectDetails,
    setErrorMessage,
  } = useProjectContext();

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (projectId && !projectDetails?.id) {
      loadProjectDetails(projectId);
    }
  }, [projectId, projectDetails?.id, loadProjectDetails]);

  const handleFollowUpQuestionWrapper = (question: string) => {
    try {
      handleFollowUpQuestion(question, chatProps);
    } catch (error) {
      console.error("Error handling follow-up question:", error);
    }
  };

  const handleEditClick = () => {
    if (!projectDetails) return;

    updateProjectDetails({
      title: projectDetails.title,
      description: projectDetails.description,
      visibility: projectDetails.visibility || VisibilityOptions.PRIVATE,
      updatedAt: new Date().toISOString(),
    }).catch((error) => {
      console.error("Error updating project:", error);
      setErrorMessage("Failed to update project");
    });
  };

  const handleSaveEdit = async () => {
    if (!projectDetails) return;

    if (projectDetails.visibility === VisibilityOptions.PUBLIC) {
      // Handle public confirmation if needed
      await saveProjectChanges();
    } else {
      await saveProjectChanges();
    }
  };

  const saveProjectChanges = async () => {
    if (!projectDetails) return;

    try {
      await updateProjectDetails({
        title: projectDetails.title,
        description: projectDetails.description,
        visibility: projectDetails.visibility,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating project:", error);
      setErrorMessage("Failed to save project changes");
    }
  };

  return (
    <div className=" xl:grid xl:grid-cols-12 xl:grid-rows-[1fr_auto] gap-4 xl:h-[87vh]">
      <div className="xl:col-span-12 xl:col-span-3 2xl:col-span-2 row-span-1 xl:row-span-2 bg-gray-100 xl:overflow-y-auto rounded-md xl:flex xl:flex-col gap-2 xl:sticky xl:top-0 xl:max-h-full">
        <ResearchHeader handleEditClick={handleEditClick} />
        <Tabs defaultValue="cited" className="w-full px-4">
          <TabsList className="grid w-full grid-cols-1 xl:grid-cols-2">
            <TabsTrigger
              value="cited"
              className="text-xs data-[state=inactive]:text-gray-500"
            >
              <span className="hidden xl:inline">Cited</span> Sources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cited">
            <CitedSources />
          </TabsContent>
        </Tabs>
      </div>

      <div
        className="col-span-12 xl:col-span-9 2xl:col-span-10 row-span-1 xl:overflow-scroll xl:max-h-full"
        ref={chatContainerRef}
      >
        {!isLoading && chatProps && projectDetails?.chatflowid ? (
          <div className="flex flex-col w-full gap-2 xl:gap-4">
            <div className="xl:h-full w-full chatbot-container">
              <ChatFullPage
                botProps={{
                  ...chatProps,
                  chatflowid: projectDetails.chatflowid,
                  // className: "w-full chatbot inline-block",
                }}
              />
            </div>
          </div>
        ) : (
          <div>Loading chat...</div>
        )}
      </div>
      {!!followUpQuestions?.length && (
        <div className="col-span-12 xl:col-span-9">
          <FollowUpQuestions />
        </div>
      )}
    </div>
  );
};

export default ResearchProject;

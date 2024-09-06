"use client";
import { useEffect } from "react";
import ChatFullPage from "./ChatFullPage";
import PineconeMetadataFilterSelect from "./PineconeMetadataFilterSelect";
import SourceDocumentsSidebar from "./SourceDocumentsSidebar";
import { useChatContext } from "../contexts/ChatContext";
import { locales, topics } from "../chatbots/config/chatflowConfig";

const Homepage = () => {
  const {
    chatProps,
    addSourceDocuments,
    sourceDocuments,
    clearSourceDocuments,
  } = useChatContext();

  useEffect(() => {
    console.log("Current chatProps:", chatProps);
  }, [chatProps]);

  useEffect(() => {
    if (chatProps?.observersConfig?.observeMessages) {
      const originalObserveMessages = chatProps.observersConfig.observeMessages;
      chatProps.observersConfig.observeMessages = (messages) => {
        originalObserveMessages(messages);
        if (messages.length === 1) {
          // Clear source documents when there's only one message
          clearSourceDocuments();
        } else {
          const latestMessage = messages[messages.length - 1];
          if (
            latestMessage.type === "apiMessage" &&
            latestMessage.sourceDocuments
          ) {
            addSourceDocuments(latestMessage.sourceDocuments);
          }
        }
      };
    }
  }, [chatProps, addSourceDocuments, clearSourceDocuments]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <main className="flex gap-8">
          <div className="flex-grow flex flex-col gap-8 items-center">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Welcome to our chatbot page!
              </h1>
              <h3 className="text-center text-gray-600 dark:text-gray-300 mb-6">
                Please select a locale and a topic to customize your experience.
              </h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <PineconeMetadataFilterSelect
                  options={locales}
                  filterKey="locale"
                  placeholder="Select Locale"
                />
                <PineconeMetadataFilterSelect
                  options={topics}
                  filterKey="topic"
                  placeholder="Select Topic"
                />
              </div>
            </div>
            {chatProps && (
              <div className="w-full max-w-4xl">
                <ChatFullPage {...chatProps} className="w-full" />
              </div>
            )}
          </div>
          <SourceDocumentsSidebar documents={sourceDocuments} />
        </main>
      </div>
    </div>
  );
};

export default Homepage;

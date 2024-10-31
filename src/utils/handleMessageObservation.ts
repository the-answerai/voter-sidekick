import { type Message } from "@/chatbots/default";
import { type CitedSource, SourceDocument } from "../types";
import getFollowUpQuestions from "./getFollwUpQuestions";

export async function handleMessageObservation(
  messages: Message[],
  addSourceDocuments: (docs: SourceDocument[]) => void,
  clearSourceDocuments: () => void,
) {
  try {
    if (messages.length === 1) {
      clearSourceDocuments();
      return { citedSources: [], followUpQuestions: [] };
    }

    const latestMessage = messages[messages.length - 1];

    if (
      latestMessage.type === "apiMessage" &&
      Array.isArray(latestMessage?.sourceDocuments) &&
      !!latestMessage.sourceDocuments.length
    ) {
      addSourceDocuments(latestMessage.sourceDocuments);
      const newCitedSources: CitedSource[] = latestMessage.sourceDocuments.map(
        (doc: SourceDocument) => {
          const { id, title, ...otherMetadata } = doc.metadata;

          return {
            id: id || "Unknown ID",
            title: title || "Unknown Title",
            ...otherMetadata,
            chunks: [doc.pageContent],
          };
        },
      );

      const followUpQuestions = await getFollowUpQuestions(
        latestMessage,
        latestMessage.message,
      );

      return { citedSources: newCitedSources, followUpQuestions };
    }

    return { citedSources: [], followUpQuestions: [] };
  } catch (error) {
    console.error("Error handling message observation:", error);
    throw new Error("Failed to process message observation");
  }
}

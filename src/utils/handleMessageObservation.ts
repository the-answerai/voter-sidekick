import { type Message } from "@/chatbots/default";
import { type CitedSource, SourceDocument } from "../types";
import getFollowUpQuestions from "./getFollowUpQuestions";

type ObservationResult = {
  citedSources: CitedSource[];
  followUpQuestions: string[];
};

export async function handleMessageObservation(
  messages: Message[],
  addSourceDocuments: (docs: SourceDocument[]) => void,
  clearSourceDocuments: () => void,
): Promise<ObservationResult> {
  try {
    if (messages.length === 1) {
      clearSourceDocuments();
      return { citedSources: [], followUpQuestions: [] };
    }

    const latestMessage: Message = messages[messages.length - 1];

    if (!latestMessage?.message) {
      return { citedSources: [], followUpQuestions: [] };
    }

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
        messages,
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

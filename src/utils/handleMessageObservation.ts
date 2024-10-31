import type { CitedSource, Message, SourceDocument } from "../types";
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
          const id = doc.metadata.id || doc.metadata.url ||
            doc.metadata.sourceUrl || "Unknown ID";
          const pageNumber = doc.metadata["loc.pageNumber"] || "1";
          const title = doc.metadata.title || "Unknown Title";

          return {
            ...doc.metadata,
            id,
            title,
            chunks: [{ pageNumber, text: doc.pageContent }],
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

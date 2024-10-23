import { SourceDocument, CitedSource } from "../types";
import getFollowUpQuestions from "./getFollowUpQuestions";

export async function handleMessageObservation(
  messages: any[],
  addSourceDocuments: (docs: SourceDocument[]) => void,
  clearSourceDocuments: () => void
) {
  try {
    if (messages.length === 1) {
      clearSourceDocuments();
      return { citedSources: [], followUpQuestions: [] };
    }

    const latestMessage = messages[messages.length - 1];
    if (
      latestMessage.type === "apiMessage" &&
      latestMessage.sourceDocuments &&
      Array.isArray(latestMessage.sourceDocuments)
    ) {
      addSourceDocuments(latestMessage.sourceDocuments);
      const newCitedSources: CitedSource[] = latestMessage.sourceDocuments.map((doc: SourceDocument) => {
        const { id, title, ...otherMetadata } = doc.metadata;
        return {
          id: id || "Unknown ID",
          title: title || "Unknown Title",
          ...otherMetadata,
          chunks: [doc.pageContent],
        };
      });

      const followUpQuestions = await getFollowUpQuestions(
        messages.slice(0, -1),
        latestMessage.message
      );

      return { citedSources: newCitedSources, followUpQuestions };
    }

    return { citedSources: [], followUpQuestions: [] };
  } catch (error) {
    console.error("Error handling message observation:", error);
    throw new Error("Failed to process message observation");
  }
}
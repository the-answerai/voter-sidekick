"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import {
  ChatFullPageProps,
  PineconeMetadataFilter,
  SourceDocument,
} from "../types";
import defaultChatProps from "../chatbots/default";
import { updateFilter } from "../utils/updateFilter";
import { updateChatflowConfig } from "../utils/updateChatflowConfig";

interface ChatContextType {
  chatProps: ChatFullPageProps | null;
  updateMetadataFilter: (key: string, value: string | number) => void;
  updateTopK: (value: number) => void;
  sourceDocuments: SourceDocument[];
  addSourceDocuments: (newDocuments: SourceDocument[]) => void;
  clearSourceDocuments: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chatProps, setChatProps] = useState<ChatFullPageProps | null>(
    defaultChatProps
  );
  const [sourceDocuments, setSourceDocuments] = useState<SourceDocument[]>([]);

  const updateMetadataFilter = useCallback(
    (key: string, value: string | number) => {
      setChatProps((prevProps) => {
        if (!prevProps) return null;

        const prevFilter = (prevProps.chatflowConfig?.pineconeMetadataFilter ||
          {}) as PineconeMetadataFilter;
        const updatedFilter = updateFilter(prevFilter, key, value);
        const updatedChatflowConfig = updateChatflowConfig(
          prevProps.chatflowConfig || {},
          updatedFilter
        );

        return {
          ...prevProps,
          chatflowConfig: updatedChatflowConfig,
        };
      });
    },
    []
  );

  const updateTopK = useCallback((value: number) => {
    setChatProps((prevProps) => {
      if (!prevProps) return null;

      return {
        ...prevProps,
        chatflowConfig: {
          ...prevProps.chatflowConfig,
          topK: value,
        },
      };
    });
  }, []);

  const addSourceDocuments = useCallback((newDocuments: SourceDocument[]) => {
    setSourceDocuments((prevDocuments) => {
      const updatedDocuments = [...prevDocuments];
      newDocuments.forEach((newDoc) => {
        const existingDocIndex = updatedDocuments.findIndex(
          (doc) =>
            doc.metadata.url === newDoc.metadata.url &&
            doc.metadata["loc.pageNumber"] === newDoc.metadata["loc.pageNumber"]
        );
        if (existingDocIndex === -1) {
          updatedDocuments.push(newDoc);
        } else {
          updatedDocuments[existingDocIndex] = newDoc;
        }
      });
      return updatedDocuments;
    });
  }, []);

  const clearSourceDocuments = useCallback(() => {
    setSourceDocuments([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chatProps,
        updateMetadataFilter,
        updateTopK,
        sourceDocuments,
        addSourceDocuments,
        clearSourceDocuments,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

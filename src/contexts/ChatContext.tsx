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

interface ChatContextType {
  chatProps: ChatFullPageProps | null;
  updateMetadataFilter: (
    key: string,
    value: string | number | string[]
  ) => void;
  updateTopK: (value: number) => void;
  sourceDocuments: SourceDocument[];
  addSourceDocuments: (newDocuments: SourceDocument[]) => void;
  clearSourceDocuments: () => void;
  updateChatflowID: (chatflowID: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chatProps, setChatProps] = useState<ChatFullPageProps | null>(() => ({
    ...defaultChatProps,
    chatflowConfig: {
      ...defaultChatProps.chatflowConfig,
      pineconeNamespace: process.env.NEXT_PUBLIC_PINECONE_NAMESPACE,
      pineconeMetadataFilter: {
        ...defaultChatProps.chatflowConfig?.pineconeMetadataFilter,
      },
    },
  }));
  const [sourceDocuments, setSourceDocuments] = useState<SourceDocument[]>([]);

  const updateMetadataFilter = useCallback(
    (key: string, value: string | number | string[]) => {
      setChatProps((prevProps) => {
        if (!prevProps) return null;

        const prevFilter = (prevProps.chatflowConfig?.pineconeMetadataFilter ||
          {}) as PineconeMetadataFilter;
        const updatedFilter = updateFilter(prevFilter, key, value);

        return {
          ...prevProps,
          chatflowConfig: {
            ...prevProps.chatflowConfig,
            pineconeMetadataFilter: updatedFilter,
          },
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

  const updateChatflowID = useCallback((chatflowID: string) => {
    setChatProps((prevProps) => {
      if (!prevProps) return null;

      return {
        ...prevProps,
        chatflowid: chatflowID,
      };
    });
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
        updateChatflowID,
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

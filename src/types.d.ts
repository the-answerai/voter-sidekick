import { ThemeProps } from "aai-embed-react";
export interface PineconeMetadataFilter {
  topic?: metaDataFilters.topic;
  url?: metaDataFilters.url;
  locale?: metaDataFilters.locale;
  source?: metaDataFilters.source;
  topK?: number;
}
export interface ChatFullPageProps {
  chatflowid: string;
  apiHost: string;
  chatflowConfig?: {
    pineconeMetadataFilter?: PineconeMetadataFilter;
    handleUserMessage?: (userMessage: string) => void;
  };
  observersConfig?: {
    observeUserInput?: (userInput: string) => void;
    observeLoading?: (loading: boolean) => void;
    observeMessages?: (
      messages: {
        [x: string]: string;
        userMessage?: string;
        botMessage?: string;
        error?: Error;
      }[],
    ) => void; // Updated type
  };
  style?: CSSProperties;
  className?: string;
  messages?: any[];
  theme?: {
    button?: {
      size?: "medium" | "large";
      backgroundColor?: string;
      iconColor?: string;
      customIconSrc?: string;
      bottom?: number;
      right?: number;
    };
    chatWindow?: {
      showTitle?: boolean;
      title?: string;
      titleAvatarSrc?: string;
      showAgentMessages?: boolean;
      welcomeMessage?: string;
      errorMessage?: string;
      backgroundColor?: string;
      height?: number;
      width?: number;
      fontSize?: number;
      poweredByTextColor?: string;
      botMessage?: {
        backgroundColor?: string;
        textColor?: string;
        showAvatar?: boolean;
        avatarSrc?: string;
      };
      userMessage?: {
        backgroundColor?: string;
        textColor?: string;
        showAvatar?: boolean;
        avatarSrc?: string;
      };
      textInput?: {
        placeholder?: string;
        backgroundColor?: string;
        textColor?: string;
        sendButtonColor?: string;
        maxChars?: number;
        maxCharsWarningMessage?: string;
        autoFocus?: boolean;
        sendMessageSound?: boolean;
        receiveMessageSound?: boolean;
      };
      feedback?: {
        color?: string;
      };
      footer?: {
        textColor?: string;
        text?: string;
        company?: string;
        companyLink?: string;
      };
    };
  };
}

// Add these new type definitions

export interface Law {
  id: number;
  title: string;
  summary: string;
  tags: string[];
  source_link: string;
  pdf_link: string;
  locale: Locale;
  date_added: Date;
  topics: string[];
}

export enum Locale {
  FEDERAL = "FEDERAL",
  STATE = "STATE",
  LOCAL = "LOCAL",
}

export interface UserSubmission {
  id: number;
  law_title: string;
  law_source: string;
  pdf_link: string;
  user_id: number;
  status: SubmissionStatus;
  denial_reason?: string;
  date_submitted: Date;
  user: User;
}

export enum SubmissionStatus {
  NEW = "NEW",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
}

export interface User {
  id: number;
  email: string;
  username: string;
  submissions: UserSubmission[];
}

interface CitedSource {
  id: string;
  title: string;
  congress: string;
  url?: string;
  policyArea: string;
  chunks: string[];
}

export interface SourceDocument {
  pageContent: string;
  metadata: {
    id: string;
    title: string;
    congress: string;
    url?: string;
    policyArea: string;
    chunks: string[];
    "loc.pageNumber"?: number;
  };
}

interface ChatflowConfig {
  rephrasePrompt: string;
  responsePrompt: string;
  pineconeMetadataFilter?: Partial<PineconeMetadataFilter>;
}

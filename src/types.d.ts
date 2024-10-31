import { VisibilityOptions } from "@/utils/supabaseClient";

import type { BubbleProps } from "aai-embed";

export interface PineconeMetadataFilter {
  topic?: metaDataFilters.topic;
  url?: metaDataFilters.url;
  locale?: metaDataFilters.locale;
  source?: metaDataFilters.source;
  topK?: number;
}

export interface Excerpt {
  id?: string;
  sourceId?: string;
  text?: string;
  page?: number;
  chunk?: string;
  savedAt?: string;
  suggestedQuestions?: string[];
}

type ExpandRecursive<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursive<O[K]> }
  : never
  : T;

//  interface ThemeProps
// extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface CBotProps {
  chatflowid: string;
  apiHost: string;
  messages?: Message[];
  observersConfig?: any;

  chatflowConfig?: {
    pineconeMetadataFilter?: PineconeMetadataFilter;
    pineconeNamespace?: string;
    handleUserMessage?: (userMessage: string) => void;
  };
  handleUserMessage?: (userMessage: string) => void;
  theme?: BubbleProps["theme"];
  // theme?: ExpandRecursive<BubbleProps>;
}
// export interface CBotProps {
//   chatflowid: string;
//   apiHost: string;
//   chatflowConfig?: {
//     pineconeMetadataFilter?: PineconeMetadataFilter;
//     handleUserMessage?: (userMessage: string) => void;
//   };
//   observersConfig?: {
//     observeUserInput?: (userInput: string) => void;
//     observeLoading?: (loading: boolean) => void;
//     observeMessages?: (
//       messages: {
//         [x: string]: string;
//         userMessage?: string;
//         botMessage?: string;
//         error?: Error;
//       }[],
//     ) => void;
//     observeStreamEnd?: (
//       messages: {
//         [x: string]: string;
//         userMessage?: string;
//         botMessage?: string;
//         error?: Error;
//       }[],
//     ) => void; // Updated type// Updated type
//   };
//   style?: CSSProperties;
//   className?: string;
//   messages?: any[];
//   theme?: {
//     button?: {
//       size?: "medium" | "large";
//       backgroundColor?: string;
//       iconColor?: string;
//       customIconSrc?: string;
//       bottom?: number;
//       right?: number;
//     };
//     chatWindow?: {
//       showTitle?: boolean;
//       title?: string;
//       titleAvatarSrc?: string;
//       showAgentMessages?: boolean;
//       welcomeMessage?: string;
//       errorMessage?: string;
//       backgroundColor?: string;
//       height?: number;
//       width?: number;
//       fontSize?: number;
//       poweredByTextColor?: string;
//       botMessage?: {
//         backgroundColor?: string;
//         textColor?: string;
//         showAvatar?: boolean;
//         avatarSrc?: string;
//       };
//       userMessage?: {
//         backgroundColor?: string;
//         textColor?: string;
//         showAvatar?: boolean;
//         avatarSrc?: string;
//       };
//       textInput?: {
//         placeholder?: string;
//         backgroundColor?: string;
//         textColor?: string;
//         sendButtonColor?: string;
//         maxChars?: number;
//         maxCharsWarningMessage?: string;
//         autoFocus?: boolean;
//         sendMessageSound?: boolean;
//         receiveMessageSound?: boolean;
//       };
//       feedback?: {
//         color?: string;
//       };
//       footer?: {
//         textColor?: string;
//         text?: string;
//         company?: string;
//         companyLink?: string;
//       };
//     };
//   };
// }

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

export interface ResearchProject {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  chatflowid: string | null;
  hasFilters: boolean;
}

export type Excerpt = {
  sourceId: string;
  chunk: string;
  savedAt: string;
};

export interface ProjectDetails {
  id: number;
  title: string;
  description: string;
  mainSourceUrl?: string;
  imageUrl?: string;
  intent?: string;
  chatflowid: string | null;
  savedExcerpts: Excerpt[];
  visibility: VisibilityOptions;
  updatedAt?: string;
}

export interface Document {
  id: string;
  title: string;
  author: string;
  date: string;
  isValid: boolean;
  relevance: number;
  chunks?: string[];
  pdfUrl?: string;
  sourceUrl?: string;
  url?: string;
}

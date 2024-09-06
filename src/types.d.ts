export interface PineconeMetadataFilter {
  topic?: metaDataFilters.topic;
  url?: metaDataFilters.url;
  locale?: metaDataFilters.locale;
  source?: metaDataFilters.source;
}
export interface ChatFullPageProps {
  chatflowid: string;
  apiHost: string;
  chatflowConfig?: {
    pineconeMetadataFilter?: PineconeMetadataFilter;
  };
  observersConfig?: {
    observeUserInput?: (userInput: string) => void;
    observeLoading?: (loading: boolean) => void;
    observeMessages?: (
      messages: { userMessage?: string; botMessage?: string; error?: Error }[]
    ) => void; // Updated type
  };
  style?: CSSProperties;
  className?: string;
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

import type { CBotProps, PineconeMetadataFilter } from "../types";
import generateThemeColors from "../utils/generateThemeColors";
import { getChatflowConfig } from "./config/chatflowConfig";

// Change the chatbot theme color here
const baseColor = "rgb(107, 114, 128)";
const themeColors = generateThemeColors(baseColor);

const defaultMetaDataFilters: PineconeMetadataFilter = {
  // url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB1047",
  // source: "https://s3.theanswer.ai/sb1047",
};

// const fontSize = 16;

type messageType =
  | "apiMessage"
  | "userMessage"
  | "usermessagewaiting"
  | "leadCaptureMessage";

export interface Message {
  messageId?: string;
  message?: string;
  type?: messageType;
  sourceDocuments?: any;
  fileAnnotations?: any;
  role?: string;
  content?: string;
  // fileUploads?: Partial<FileUpload>[];
  // agentReasoning?: IAgentReasoning[];
  // action?: IAction | null;
  // rating?: FeedbackRatingType;
}

const defaultConfig: CBotProps = {
  chatflowid: "9ee4eee1-931d-4007-bc9f-b1431ddabfa9",
  // chatflowid: "5d6a7f89-3133-40bb-a0f6-30f75ae43a69", // Tool Call
  apiHost: "https://prod.studio.theanswer.ai",
  chatflowConfig: getChatflowConfig(defaultMetaDataFilters),
  // observersConfig: {
  //   observeUserInput: (userInput: string) => {
  //     // Add default callback here
  //   },
  //   observeLoading: (loading: boolean) => {
  //     // Add default callback here
  //   },
  //   observeMessages: (messages?: Message[]) => {
  //     console.log("observeMessages", messages);
  //     // Add default callback here
  //   },
  //   // observeStreamEnd: (messages?: Message[]) => {
  //   //   console.log("observeStreamEnd", messages);
  //   //   // Add default callback here
  //   // },
  // },
  // isFullPage: true,
  theme: {
    // isFullPage: true,
    button: {
      size: "medium",
      backgroundColor: themeColors.buttonBackgroundColor,
      iconColor: themeColors.buttonIconColor,
      customIconSrc: "https://example.com/icon.png",
      bottom: 10,
      right: 10,
    },
    // starterPrompts: ["How can I help you?", "What are you looking for?"],
    // starterPromptFontSize: 12,
    chatWindow: {
      showTitle: true,
      title: "Voter Sidekick",
      sourceDocsTitle: "hello",
      showAgentMessages: false,
      welcomeMessage:
        "📢 Quick Disclaimer: While AI can sometimes make mistakes, just like politicians do (though perhaps not quite as often!), I strive for accuracy. This tool is for educational and entertainment purposes only. Please do your own research and verify information from original sources.",
      errorMessage: "This is a custom error message",
      backgroundColor: themeColors.chatWindowBackgroundColor,
      height: -1,
      width: -1,

      poweredByTextColor: themeColors.chatWindowPoweredByTextColor,
      botMessage: {
        backgroundColor: themeColors.botMessageBackgroundColor,
        textColor: themeColors.botMessageTextColor,
        showAvatar: false,
      },
      userMessage: {
        backgroundColor: themeColors.userMessageBackgroundColor,
        textColor: themeColors.userMessageTextColor,
        showAvatar: false,
      },
      textInput: {
        placeholder: "Type your message...",
        backgroundColor: themeColors.textInputBackgroundColor,
        textColor: themeColors.textInputTextColor,
        sendButtonColor: themeColors.userMessageBackgroundColor,
        maxChars: 200,
        maxCharsWarningMessage: "You have exceeded the character limit.",
        autoFocus: true,
        sendMessageSound: false,
        receiveMessageSound: false,
      },
      feedback: {
        color: themeColors.feedbackColor,
      },
      footer: {
        textColor: themeColors.footerTextColor,
        // text: "Powered by Flowise",
        // company: "Flowise",
        // companyLink: "https://flowiseai.com",
      },
    },
  },
};

export default defaultConfig;

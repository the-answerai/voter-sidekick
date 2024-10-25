import type { ChatFullPageProps, PineconeMetadataFilter } from "../types";
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

const defaultConfig: ChatFullPageProps = {
  chatflowid: "9ee4eee1-931d-4007-bc9f-b1431ddabfa9",
  // chatflowid: "5d6a7f89-3133-40bb-a0f6-30f75ae43a69", // Tool Call
  apiHost: "https://public.flowise.theanswer.ai",
  chatflowConfig: getChatflowConfig(defaultMetaDataFilters),
  observersConfig: {
    //   observeUserInput: (userInput: string) => {
    //     // console.log("User input observed:", userInput);
    //   },
    //xw   observeLoading: (loading: boolean) => {
    //     // console.log("Loading state observed:", loading);
    //   },
    observeMessages: (messages) => {
      console.log("Messages observed again:", messages);
    },
  },
  style: {},
  className: "w-full",
  theme: {
    button: {
      size: "medium",
      backgroundColor: themeColors.buttonBackgroundColor,
      iconColor: themeColors.buttonIconColor,
      customIconSrc: "https://example.com/icon.png",
      bottom: 10,
      right: 10,
    },
    chatWindow: {
      // showTitle: false,
      // title: "Default Bot Here",
      // titleAvatarSrc:
      //   "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
      showAgentMessages: true,
      welcomeMessage:
        "Hello! Welcome to the chatbot! This is a custom welcome message",
      errorMessage: "This is a custom error message",
      backgroundColor: themeColors.chatWindowBackgroundColor,
      height: -1,
      width: -1,
      //fontSize,
      poweredByTextColor: themeColors.chatWindowPoweredByTextColor,
      botMessage: {
        backgroundColor: themeColors.botMessageBackgroundColor,
        textColor: themeColors.botMessageTextColor,
        showAvatar: false,
        //fontSize,
        avatarSrc:
          "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png",
      },
      userMessage: {
        backgroundColor: themeColors.userMessageBackgroundColor,
        textColor: themeColors.userMessageTextColor,
        showAvatar: false,
        //fontSize,
        avatarSrc:
          "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
      },
      textInput: {
        placeholder: "Type your message...",
        backgroundColor: themeColors.textInputBackgroundColor,
        textColor: themeColors.textInputTextColor,
        sendButtonColor: themeColors.textInputSendButtonColor,
        maxChars: 200,
        //fontSize,
        maxCharsWarningMessage: "You have exceeded the character limit.",
        autoFocus: true,
        sendMessageSound: true,
        receiveMessageSound: true,
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

import { type ChatFullPageProps } from "../types";
import generateThemeColors from "../utils/generateThemeColors";

const baseColor = "#ff0000"; // Example base color
const themeColors = generateThemeColors(baseColor);

const defaultConfig: ChatFullPageProps = {
  chatflowid: "",
  apiHost: "",
  chatflowConfig: {},
  observersConfig: {
    observeUserInput: (userInput: string) => {
      console.log("User input observed:", userInput);
    },
    observeLoading: (loading: boolean) => {
      console.log("Loading state observed:", loading);
    },
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
      showTitle: true,
      title: "Default Bot Here",
      titleAvatarSrc:
        "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
      showAgentMessages: true,
      welcomeMessage:
        "Hello! Welcome to the chatbot! This is a custom welcome message",
      errorMessage: "This is a custom error message",
      backgroundColor: themeColors.chatWindowBackgroundColor,
      height: 700,
      width: -1,
      fontSize: 12,
      poweredByTextColor: themeColors.chatWindowPoweredByTextColor,
      botMessage: {
        backgroundColor: themeColors.botMessageBackgroundColor,
        textColor: themeColors.botMessageTextColor,
        showAvatar: true,
        avatarSrc:
          "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png",
      },
      userMessage: {
        backgroundColor: themeColors.userMessageBackgroundColor,
        textColor: themeColors.userMessageTextColor,
        showAvatar: true,
        avatarSrc:
          "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
      },
      textInput: {
        placeholder: "Type your message...",
        backgroundColor: themeColors.textInputBackgroundColor,
        textColor: themeColors.textInputTextColor,
        sendButtonColor: themeColors.textInputSendButtonColor,
        maxChars: 200,
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
        text: "Powered by Flowise",
        company: "Flowise",
        companyLink: "https://flowiseai.com",
      },
    },
  },
};

export default defaultConfig;

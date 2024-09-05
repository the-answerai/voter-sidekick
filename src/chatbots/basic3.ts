import { type ChatFullPageProps } from "../types";
import defaultConfig from "./default";
import { deepMerge } from "../utils/deepMerge";
import generateThemeColors from "../utils/generateThemeColors";

const baseColor = "#0000ff"; // Example base color
const themeColors = generateThemeColors(baseColor);

const specificConfig: ChatFullPageProps = {
  chatflowid: "8bde9d3f-2ea7-4380-aba9-e7ec9f07115f",
  apiHost: "https://staging.flowise.theanswer.ai",
  theme: {
    button: {
      backgroundColor: themeColors.buttonBackgroundColor,
    },
    chatWindow: {
      title: "Blue Bot",
      welcomeMessage:
        "Hello! Welcome to the blue chatbot! This is a custom welcome message",
      backgroundColor: themeColors.chatWindowBackgroundColor,
      poweredByTextColor: themeColors.chatWindowPoweredByTextColor,
      botMessage: {
        backgroundColor: themeColors.botMessageBackgroundColor,
        textColor: themeColors.botMessageTextColor,
      },
      userMessage: {
        backgroundColor: themeColors.userMessageBackgroundColor,
        textColor: themeColors.userMessageTextColor,
      },
      textInput: {
        backgroundColor: themeColors.textInputBackgroundColor,
        textColor: themeColors.textInputTextColor,
        sendButtonColor: themeColors.textInputSendButtonColor,
      },
      feedback: {
        color: themeColors.feedbackColor,
      },
      footer: {
        textColor: themeColors.footerTextColor,
      },
    },
  },
};

const config = deepMerge(defaultConfig, specificConfig);

export default config;

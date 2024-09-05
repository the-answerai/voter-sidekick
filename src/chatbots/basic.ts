import { type ChatFullPageProps } from "../types";
import defaultConfig from "./default";
import { deepMerge } from "../utils/deepMerge";
import generateThemeColors from "../utils/generateThemeColors";

const baseColor = "#FFA500"; // Example base color
const themeColors = generateThemeColors(baseColor);

const specificConfig: ChatFullPageProps = {
  chatflowid: "8bde9d3f-2ea7-4380-aba9-e7ec9f07115f",
  apiHost: "https://staging.flowise.theanswer.ai",
  theme: {
    button: {
      backgroundColor: themeColors.buttonBackgroundColor,
    },
    chatWindow: {
      title: "Default Bot",
      welcomeMessage:
        "Hello! Welcome to the default chatbot! This is a custom welcome message",
    },
  },
};

const config = deepMerge(defaultConfig, specificConfig);

export default config;

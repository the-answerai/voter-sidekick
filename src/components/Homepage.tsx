"use client";
import { useState, useEffect, ChangeEvent } from "react";
import ChatFullPage from "./ChatFullPage";
import { type ChatFullPageProps } from "../types";
import DynamicChatSelect from "./DynamicChatSelect";
import chatbotFiles from "../chatbots/config/chatbotConfig";

interface ChatOptions {
  [key: string]: string;
}

const Homepage = () => {
  const [chatProps, setChatProps] = useState<ChatFullPageProps | null>(null);
  const [chatOptions, setChatOptions] = useState<ChatOptions>({});

  useEffect(() => {
    const loadChatbots = async () => {
      const options: ChatOptions = {};
      for (const key in chatbotFiles) {
        const file = chatbotFiles[key];
        const data = await import(`../chatbots/${file}`);
        options[key] = data.default as ChatFullPageProps;
      }
      console.log("Chat options:", options); // Debugging line
      setChatOptions(options);
    };

    loadChatbots();
  }, []);

  const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setChatProps(chatOptions[newValue] as ChatFullPageProps | null);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center w-full">
        {/* <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}
        <div className="text-center sm:text-center w-full p-4">
          <p>
            Welcome to our chatbot page! Please select an option from the
            dropdown below to customize your experience.
          </p>
          <DynamicChatSelect
            onChange={handleDropdownChange}
            options={Object.keys(chatOptions).sort()}
          />
        </div>
        {chatProps && <ChatFullPage {...chatProps} className="w-full" />}
      </main>
    </div>
  );
};

export default Homepage;

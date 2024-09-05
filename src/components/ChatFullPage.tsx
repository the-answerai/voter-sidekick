"use client";
import React from "react";
import { ChatFullPageProps } from "../types";
import { FullPageChat } from "aai-embed-react";

const ChatFullPage: React.FC<ChatFullPageProps> = ({
  chatflowid,
  apiHost,
  theme,
  ...restProps // Collect additional props
}) => {
  if (!chatflowid || !apiHost) return null;

  return (
    <div data-testid="ChatFullPage" className="flex flex-col h-full w-fulls">
      <div className="flex-grow flex flex-col">
        <div className="flex-grow">
          <FullPageChat
            chatflowid={chatflowid}
            apiHost={apiHost}
            theme={theme}
            {...restProps} // Pass additional props
          />
        </div>
      </div>
    </div>
  );
};

export default ChatFullPage;

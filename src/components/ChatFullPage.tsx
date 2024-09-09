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
    <div data-testid="ChatFullPage" className="flex flex-col">
      <div className="flex-grow flex flex-col">
        <div className="flex-grow">
          <FullPageChat
            chatflowid={chatflowid}
            apiHost={apiHost}
            {...restProps}
            // @ts-expect-error theme is not typed
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatFullPage;

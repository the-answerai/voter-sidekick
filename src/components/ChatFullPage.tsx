"use client";
import React from "react";
import { CBotProps } from "../types";
import { FullPageChat } from "aai-embed-react";

// Extend CBotProps to include wrapperClassName
interface ChatFullPageProps {
  botProps: CBotProps;
  wrapperClassName?: string;
}

const ChatFullPage: React.FC<ChatFullPageProps> = ({
  botProps,
  wrapperClassName,
  ...restProps
}) => {
  if (!botProps?.chatflowid || !botProps?.apiHost) return null;

  return (
    <div
      data-testid="ChatFullPage"
      {...restProps}
      className={`w-full inline-block chatbot-wrap ${wrapperClassName || ""}`}
    >
      <FullPageChat
        {...botProps}
        className={`w-full inline-block chatbot-wrap`}
      />
    </div>
  );
};

export default ChatFullPage;

"use client";

import React from "react";
import { ChatProvider } from "../contexts/ChatContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}

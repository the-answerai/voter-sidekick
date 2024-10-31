"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ChatProvider } from "../contexts/ChatContext";
import Link from "next/link";
import Image from "next/image";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ChatProvider>
      <div className="max-h-screen overflow-none bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300">
        <div className="bg-red-500/80 text-white text-center py-2">
          <a
            href="https://www.usa.gov/find-polling-place"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            🗳️ Make sure you&apos;re registered to vote! Click here to check
            your registration status and polling location.
          </a>
        </div>
        <header className="w-full bg-white dark:bg-secondary-800 shadow-sm ">
          <nav className="w-full px-4 sm:px-6 lg:px-8 h-[5vh]">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0 logo-header">
                  <Link href="/" aria-label="Go to homepage">
                    <Image
                      src="/voter-sidekick.png"
                      alt="Voter Sidekick Logo"
                      width={200}
                      height={40}
                      className="h-10 w-auto"
                    />
                  </Link>
                </div>
                <div className="hidden md:flex space-x-4">
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    About
                  </Link>
                  <Link
                    href="/volunteer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Volunteer
                  </Link>
                  <Link
                    href="https://github.com/the-answerai/voter-sidekick"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Github
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main className="w-full max-h-[94vh] overflow-hidden">
          <div className="px-4 py-6 sm:px-6 lg:px-8 overflow-scroll max-h-full">
            <div className="prose dark:prose-dark max-w-none">{children}</div>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}

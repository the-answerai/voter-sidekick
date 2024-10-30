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
              <div className="flex-shrink-0 logo-header">
                <Link href="/" aria-label="Go to homepage">
                  <Image
                    src="/voter-sidekick.png" // Update this path to your actual logo file
                    alt="Voter Sidekick Logo"
                    width={200} // Adjust the width as needed
                    height={40} // Adjust the height as needed
                    className="h-10 w-auto" // Adjust the class as needed for proper sizing
                  />
                </Link>
              </div>
              {/* <div className="flex items-center space-x-4">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-md text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  aria-label="Toggle dark mode"
                >
                  {theme === "dark" ? (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
               <div className="relative">
                  <button
                    className="flex items-center text-sm font-medium text-secondary-500 hover:text-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    aria-label="User menu"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src="https://lh3.googleusercontent.com/a/ACg8ocKhtdPiH2CijB_Biz1PkU5xIahtYcE3O4BQLcEA9bsDb1dhqFZQ=s96-c"
                      alt="User avatar"
                      width={32}
                      height={32}
                    />
                  </button>
                </div>
              </div> */}
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

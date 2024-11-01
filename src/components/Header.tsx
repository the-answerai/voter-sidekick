import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useGlobalContext } from "@/contexts/GlobalContext";
import NewSidekickDialog from "@/components/NewSidekickDialog";

const Header: React.FC = () => {
  const { isAdmin } = useGlobalContext();

  return (
    <header className="w-full bg-white dark:bg-secondary-800 shadow-sm">
      <nav className="w-full px-4 sm:px-6 xl:px-8 h-[5vh]">
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
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
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

          <div className="flex items-center">
            {isAdmin && <NewSidekickDialog />}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

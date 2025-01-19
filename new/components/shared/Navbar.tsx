"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button"; // Assuming you're using a UI library for the Button component
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { status } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="container mx-auto flex justify-between items-center px-6 sm:px-8 py-6 fixed w-full z-50 bg-transparent backdrop-blur-md">
      <Link href="/">
        <h1 className="text-black text-3xl font-bold">
          zen<span className="!text-purple-500">haven</span>
        </h1>
      </Link>

      <div className="hidden md:flex space-x-8 text-zinc-500/50 text-sm sm:text-base">
        <ul className="flex space-x-3">
          {status !== "authenticated" ? (
            <Link
              href="/login"
              className="relative px-4 py-2 font-bold rounded-full hover:bg-blue-200/50 transition duration-300 transform hover:scale-105"
            >
              Login
            </Link>
          ) : (
            <>
              <li>
                <Link
                  href="/dashboard"
                  className="relative px-4 py-2 font-bold rounded-full hover:bg-blue-200/50 transition duration-300 transform hover:scale-105"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/new"
                  className="relative px-4 py-2 font-bold rounded-full hover:bg-blue-200/50 transition duration-300 transform hover:scale-105"
                >
                  Generate Meditation
                </Link>
              </li>
              <li>
                <Link
                  href="/logout"
                  className="relative px-4 py-2 font-bold rounded-full hover:bg-blue-200/50 transition duration-300 transform hover:scale-105"
                >
                  Log Out
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Menu Toggle Button */}
      <Button
        variant="ghost"
        className="md:hidden text-white text-3xl hover:bg-blue-200/50 rounded-full p-2 focus:ring-2 focus:ring-blue-300 transition"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? "×" : "☰"}
      </Button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-0 left-0 w-full bg-white bg-opacity-90 p-6 md:hidden">
          <ul className="space-y-6">
            {status !== "authenticated" ? (
              <li>
                <Link
                  href="/login"
                  className="text-gray-800 block px-6 py-3 rounded-lg text-lg font-medium transition duration-300 transform hover:bg-blue-200/50 hover:scale-105"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-800 block px-6 py-3 rounded-lg text-lg font-medium transition duration-300 transform hover:bg-blue-200/50 hover:scale-105"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/new"
                    className="text-gray-800 block px-6 py-3 rounded-lg text-lg font-medium transition duration-300 transform hover:bg-blue-200/50 hover:scale-105"
                    onClick={toggleMenu}
                  >
                    Generate Meditation
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

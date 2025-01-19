"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  loading: boolean;
  userId: string | null;
  session: any; // Include session even if it's in loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  console.log("session", session, "status", status);

  useEffect(() => {
    const fetchUserId = async (email: string) => {
      try {
        const response = await fetch(`/api/getUserId?email=${email}`);
        const data = await response.json();
        if (data.userId) {
          setUserId(data.userId);
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    if (status === "authenticated" && session?.user?.email) {
      fetchUserId(session.user.email);
    }

    // Session is always available, even if it's loading
    setLoading(status === "loading");
  }, [status, session]);

  // Ensure session is always available, even if it's loading
  const authSession = session ?? { user: { name: "Guest" }, email: "" };

  return (
    <AuthContext.Provider
      value={{ loading, userId, session: authSession, status }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

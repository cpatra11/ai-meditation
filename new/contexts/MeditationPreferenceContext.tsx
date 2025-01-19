"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

interface MeditationPreferences {
  id: string;
  name: string;
  createdAt: string;
  mentalHealthGoal: string;
  sessionLength: string;
  meditationType: string[];
  toneOfVoice: string;
  backgroundMusic: string[];
  frequency: string;
}

interface MeditationPreferenceContextProps {
  meditationPreferences: MeditationPreferences[];
  selectedPreference: MeditationPreferences | null;
  sortedPreferences: MeditationPreferences[];
  selectPreference: (preference: MeditationPreferences) => void;
  updateSortOrder: (order: "asc" | "desc") => void;
  error: string | null;
}

const MeditationPreferenceContext = createContext<
  MeditationPreferenceContextProps | undefined
>(undefined);

export const MeditationPreferenceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { userId } = useAuth();
  const [meditationPreferences, setMeditationPreferences] = useState<
    MeditationPreferences[]
  >([]);
  const [selectedPreference, setSelectedPreference] =
    useState<MeditationPreferences | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedPreferences, setSortedPreferences] = useState<
    MeditationPreferences[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(`/api/meditationPreferences/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch meditation preferences");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          data.forEach((preference: MeditationPreferences) => {
            if (
              !preference.createdAt ||
              isNaN(new Date(preference.createdAt).getTime())
            ) {
              preference.createdAt = new Date().toISOString();
              console.warn(
                `Invalid date format for preference id ${preference.id}, setting to current date.`
              );
            }
          });
          setMeditationPreferences(data);
        } else {
          setError("Data is not an array.");
        }
      } catch (error: any) {
        console.error(
          "Error fetching meditation preferences:",
          error.message || error
        );
        setError(error.message || "Failed to fetch meditation preferences.");
      }
    };

    if (userId) {
      fetchPreferences();
    } else {
      setError("User ID is not available.");
    }
  }, [userId]);

  useEffect(() => {
    const sorted = [...meditationPreferences].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (isNaN(dateA) || isNaN(dateB)) {
        console.error("Invalid date format detected while sorting.");
        return 0;
      }

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setSortedPreferences(sorted);
  }, [meditationPreferences, sortOrder]);

  const selectPreference = (preference: MeditationPreferences) => {
    setSelectedPreference(preference);
  };

  const updateSortOrder = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  return (
    <MeditationPreferenceContext.Provider
      value={{
        meditationPreferences,
        selectedPreference,
        sortedPreferences,
        selectPreference,
        updateSortOrder,
        error,
      }}
    >
      {children}
    </MeditationPreferenceContext.Provider>
  );
};

export const useMeditationPreference = () => {
  const context = useContext(MeditationPreferenceContext);
  if (context === undefined) {
    throw new Error(
      "useMeditationPreference must be used within a MeditationPreferenceProvider"
    );
  }
  return context;
};

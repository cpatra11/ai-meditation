"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function MeditationForm() {
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    userId: "",
    mentalHealthGoal: "",
    sessionLength: "",
    meditationType: [],
    toneOfVoice: "",
    backgroundMusic: "",
  });
  const [meditationScript, setMeditationScript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: userId,
      }));
    }
  }, [userId]);

  const handleSelectChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      const response = await fetch("/api/meditationPreferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        generateMeditation(formData);
      } else {
        console.error("Error saving preferences.");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const generateMeditation = async (formData: any) => {
    try {
      const response = await fetch("/api/generateMeditation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const meditationScript = data.generated_text || "";
        setMeditationScript(meditationScript);
        scheduleAudioGeneration(meditationScript);
      } else {
        console.error("Error generating meditation.");
      }
    } catch (error) {
      console.error("Error generating meditation:", error);
    } finally {
      setLoading(false); // Set loading state to false when done
    }
  };

  const scheduleAudioGeneration = async (meditationScript: string) => {
    if (!formData.userId) {
      console.error("User ID is required to schedule audio generation.");
      return;
    }

    meditationScript = meditationScript
      .replace(/"/g, '\\"')
      .replace(/\n/g, " ")
      .trim();
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "bhalu@cpun.com",
          password: "123456",
          userId: formData.userId,
          audioData: {
            meditationScript,
            bgmusic: formData.backgroundMusic,
          },
        }),
      });

      if (response.ok) {
        console.log("Audio generation scheduled");
      } else {
        console.error("Error scheduling audio generation.");
      }
    } catch (error) {
      console.error("Error scheduling audio generation:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-start py-10">
        <div className="flex flex-col justify-center items-center mt-[80px] max-w-4xl mx-auto px-4 py-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Personalize Your Meditation
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6 w-full"
          >
            {/* Mental Health Goal */}
            <Select
              value={formData.mentalHealthGoal}
              onValueChange={(value) =>
                handleSelectChange("mentalHealthGoal", value)
              }
            >
              <SelectTrigger className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <SelectValue placeholder="Select a Mental Health Goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Goal</SelectLabel>
                  <SelectItem value="stress-relief">Stress Relief</SelectItem>
                  <SelectItem value="focus">Focus and Productivity</SelectItem>
                  <SelectItem value="relaxation">Relaxation / Sleep</SelectItem>
                  <SelectItem value="emotional-healing">
                    Emotional Healing
                  </SelectItem>
                  <SelectItem value="mindfulness">
                    Mindfulness & Awareness
                  </SelectItem>
                  <SelectItem value="general-well-being">
                    General Well-being
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Session Length */}
            <Select
              value={formData.sessionLength}
              onValueChange={(value) =>
                handleSelectChange("sessionLength", value)
              }
            >
              <SelectTrigger className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <SelectValue placeholder="Select Session Length" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Session Duration</SelectLabel>
                  <SelectItem value="very-short">1-2 minutes</SelectItem>
                  <SelectItem value="short">5-10 minutes</SelectItem>
                  <SelectItem value="medium">15-20 minutes</SelectItem>
                  <SelectItem value="long">30+ minutes</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Meditation Type */}
            <Select
              value={formData.meditationType.join(", ")}
              onValueChange={(value) =>
                handleSelectChange("meditationType", value.split(", "))
              }
            >
              <SelectTrigger className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <SelectValue placeholder="Select Meditation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Meditation Type</SelectLabel>
                  <SelectItem value="guided">Guided Meditation</SelectItem>
                  <SelectItem value="breathing">Breathing Exercises</SelectItem>
                  <SelectItem value="body-scan">Body Scan</SelectItem>
                  <SelectItem value="visualization">Visualization</SelectItem>
                  <SelectItem value="mantra">Mantra Meditation</SelectItem>
                  <SelectItem value="sound-healing">
                    Chanting / Sound Healing
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Tone of Voice */}
            <Select
              value={formData.toneOfVoice}
              onValueChange={(value) =>
                handleSelectChange("toneOfVoice", value)
              }
            >
              <SelectTrigger className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <SelectValue placeholder="Select Tone of Voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tone of Voice</SelectLabel>
                  <SelectItem value="calm">Calm / Soft</SelectItem>
                  <SelectItem value="energetic">
                    Energetic / Motivational
                  </SelectItem>
                  <SelectItem value="neutral">Neutral / Balanced</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Background Music */}
            <Select
              value={formData.backgroundMusic}
              onValueChange={(value) =>
                handleSelectChange("backgroundMusic", value)
              }
            >
              <SelectTrigger className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <SelectValue placeholder="Select Background Music" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Background Music</SelectLabel>
                  <SelectItem value="nature-sounds">Nature Sounds</SelectItem>
                  <SelectItem value="ambient-music">Ambient Music</SelectItem>
                  <SelectItem value="binaural-beats">Binaural Beats</SelectItem>
                  <SelectItem value="silent">Silent / No Music</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-200"
                disabled={loading} // Disable the button while loading
              >
                {loading ? (
                  <span>Loading...</span> // Show loading text
                ) : (
                  <>
                    <ArrowRight className="w-6 h-6 text-white mr-2 transform transition-transform duration-200 hover:scale-110" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>{" "}
        {/* Display Meditation Script */}
        {meditationScript && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-xl font-semibold mb-4">
              Your Meditation Script has been generated! Check back after few
              minutes in the dashboard!
            </p>
          </div>
        )}
      </div>
    </>
  );
}

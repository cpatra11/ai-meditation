"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MeditationSession {
  _id: string;
  meditationScript: string;
}
interface MeditationPreferences {
  _id: string;
  mentalHealthGoal: string;
  sessionLength: number;
  meditationType: string[];
  toneOfVoice: string;
  backgroundMusic: string[];
  frequency: string;
  meditationSessions: MeditationSession[];
}
export function MeditationTable({ userId }: { userId: string }) {
  const [meditationPreferences, setMeditationPreferences] = useState<[]>([]);
  const [selectedPreference, setSelectedPreference] =
    useState<MeditationPreferences | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      const response = await fetch(`/api/meditationPreferences/${userId}`);
      const data = await response.json();
      setMeditationPreferences(data);
    };

    fetchPreferences();
  }, [userId]);

  const openModal = (preference: MeditationPreferences) => {
    setSelectedPreference(preference);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPreference(null);
  };

  return (
    <div>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Goal</th>
            <th>Session Length</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {meditationPreferences.map((preference) => (
            <tr key={preference._id}>
              <td>{preference.mentalHealthGoal}</td>
              <td>{preference.sessionLength}</td>
              <td>{preference.meditationType.join(", ")}</td>
              <td>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => openModal(preference)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPreference && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogTitle>
            {selectedPreference.mentalHealthGoal} Meditation
          </DialogTitle>
          <DialogDescription>
            <div>
              <p>
                <strong>Session Length:</strong>{" "}
                {selectedPreference.sessionLength}
              </p>
              <p>
                <strong>Meditation Types:</strong>{" "}
                {selectedPreference.meditationType.join(", ")}
              </p>
              <p>
                <strong>Tone of Voice:</strong> {selectedPreference.toneOfVoice}
              </p>
              <p>
                <strong>Background Music:</strong>{" "}
                {selectedPreference.backgroundMusic.join(", ")}
              </p>
              <p>
                <strong>Frequency:</strong> {selectedPreference.frequency}
              </p>
            </div>
            <div>
              <h3>Sessions:</h3>
              <ul>
                {selectedPreference.meditationSessions.map((session) => (
                  <li key={session._id}>{session.meditationScript}</li>
                ))}
              </ul>
            </div>
            <Button onClick={() => {}}>Delete</Button>
          </DialogDescription>
        </Dialog>
      )}
    </div>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
  createdAt: string;
  userId: string;
  meditationSessions?: MeditationSession[];
}

interface MeditationPreferenceDialogProps {
  preference: MeditationPreferences;
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function MeditationPreferenceDialog({
  preference,
  open,
  onClose,
  onDownload,
}: MeditationPreferenceDialogProps) {
  // const fetchFile = async () => {
  //   const preferenceId = preference._id; // Extract preferenceId from preference object
  //   const userId = preference.userId;

  //   // Correct query parameter format
  //   const expressApiUrl = `/api/getMeditation?userId=${userId}&preferenceId=${preferenceId}`;

  //   try {
  //     const response = await fetch(expressApiUrl, {
  //       method: "POST", // No body for GET requests
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userId, preferenceId }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch audio from server");
  //     }

  //     const audioBlob = await response.blob();
  //     const url = window.URL.createObjectURL(audioBlob); // Create a URL for the Blob

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `meditation-${preferenceId}.mp3`); // Updated filename
  //     document.body.appendChild(link);
  //     link.click();

  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error fetching the audio file:", error);
  //     // Optionally, alert the user here if needed
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{preference.mentalHealthGoal} Meditation</DialogTitle>
          <DialogDescription>
            <div>
              <p>
                <strong>Session Length:</strong> {preference.sessionLength}
              </p>
              <p>
                <strong>Meditation Types:</strong>{" "}
                {preference.meditationType.join(", ")}
              </p>
              <p>
                <strong>Tone of Voice:</strong> {preference.toneOfVoice}
              </p>
              <p>
                <strong>Background Music:</strong>{" "}
                {preference.backgroundMusic.join(", ")}
              </p>
              <p>
                <strong>Frequency:</strong> {preference.frequency}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(preference.createdAt).toLocaleDateString()}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
          <Button className="bg-red-500 text-white">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

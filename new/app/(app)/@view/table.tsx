import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { MeditationPreferenceDialog } from "./dialog"; // Import the dialog component
import { useMeditationPreference } from "@/contexts/MeditationPreferenceContext";
import { useAuth } from "@/contexts/AuthContext";

export function MeditationTable() {
  const {
    sortedPreferences,
    selectedPreference,
    selectPreference,
    updateSortOrder,
    error,
    sortOrder,
  } = useMeditationPreference();
  const { userId } = useAuth();
  const fetchFile = async () => {
    // Correct query parameter format
    const expressApiUrl = `/api/getMeditation?userId=${userId}`;

    try {
      const response = await fetch(expressApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio from server");
      }

      const audioBlob = await response.blob();
      const url = window.URL.createObjectURL(audioBlob);

      const link = document.createElement("a");
      link.href = url;
      const h = new Date().getTime();
      link.setAttribute("download", `meditation-${userId}-${h}.mp3`); // Updated filename
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching the audio file:", error);
      // Optionally, alert the user here if needed
    }
  };
  const handleSortToggle = () => {
    updateSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-col justify-start items-center py-8">
      <Button
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
        onClick={() => fetchFile()}
      >
        Download Latest Audio
      </Button>
      <Table className="w-full max-w-4xl mx-auto mt-8">
        <TableCaption>A list of your meditation preferences.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-blue-600">Goal</TableHead>
            <TableHead className="text-blue-600">Session Length</TableHead>
            <TableHead className="text-blue-600">Type</TableHead>
            <TableHead className="text-blue-600">
              <button
                onClick={handleSortToggle}
                className="text-left cursor-pointer text-blue-500"
              >
                Created At {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </TableHead>
            <TableHead className="text-right text-blue-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(sortedPreferences) && sortedPreferences.length > 0 ? (
            sortedPreferences.map((preference) => (
              <TableRow
                key={`${preference.id}-${preference.createdAt}`}
                className="hover:bg-gray-50 transition-all"
              >
                <TableCell className="capitalize">
                  {(preference as any).mentalHealthGoal
                    .split(/(?=[A-Z])/)
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")}
                </TableCell>
                <TableCell>{(preference as any).sessionLength}</TableCell>
                <TableCell>
                  {(preference as any).meditationType.join(", ")}
                </TableCell>
                <TableCell>
                  {new Date(preference.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => selectPreference(preference)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Total: {sortedPreferences.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {selectedPreference && (
        <MeditationPreferenceDialog
          preference={selectedPreference}
          open={!!selectedPreference}
          onClose={() =>
            selectPreference(null as unknown as MeditationPreferences)
          }
          onDownload={() => fetchFile()}
        />
      )}
    </div>
  );
}

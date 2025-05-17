"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TEAM_SIZES } from "@/context/GameContext"; // Ensure this is correctly defined and imported

const LOADING_TEXT = "Loading game details...";

export default function SelectTeamPage() {
  const { players, currentMission, leaderIndex, proposeTeam } = useGame();
  const router = useRouter();
  const [selection, setSelection] = useState<string[]>([]);

  // --- Start of Data Validation and Guard Clauses ---

  // 1. Check if players data is available and valid
  if (!players || players.length < 5) { // Assuming a minimum of 5 players for the game
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-xl">{LOADING_TEXT} (Waiting for player information...)</p>
      </div>
    );
  }

  // 2. Get team sizes for the current number of players
  //    (TypeScript type assertion 'as keyof typeof TEAM_SIZES' can be useful if TEAM_SIZES keys are specific numbers)
  const teamSizesForCurrentPlayerCount = TEAM_SIZES[players.length as keyof typeof TEAM_SIZES];
  if (!teamSizesForCurrentPlayerCount) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-xl text-red-600">Error: Team size definitions not found for {players.length} players.</p>
      </div>
    );
  }

  // 3. Check if currentMission is valid and get the specific team size
  if (currentMission < 1 || currentMission > teamSizesForCurrentPlayerCount.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-xl">{LOADING_TEXT} (Invalid mission number: {currentMission})</p>
      </div>
    );
  }
  const sizeForCurrentMission = teamSizesForCurrentPlayerCount[currentMission - 1];

  // 4. Check if leaderIndex is valid
  if (leaderIndex < 0 || leaderIndex >= players.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-xl">{LOADING_TEXT} (Waiting for leader information...)</p>
      </div>
    );
  }
  const currentLeader = players[leaderIndex];

  // --- End of Data Validation ---

  const togglePlayer = (name: string) => {
    if (selection.includes(name)) {
      setSelection(selection.filter((n) => n !== name));
    } else if (selection.length < sizeForCurrentMission) {
      setSelection([...selection, name]);
    }
  };

  const submitTeam = () => {
    if (selection.length === sizeForCurrentMission) {
      proposeTeam(selection);
      router.push("/vote-team");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 md:p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">Select Team</h1>
        <p className="text-center text-gray-600 mb-4">
          Mission {currentMission} &bull; Leader: <span className="font-semibold">{currentLeader}</span>
        </p>
        <p className="text-center text-lg text-gray-700 mb-6">
          Please select <span className="font-bold text-indigo-600">{sizeForCurrentMission}</span> players for the mission.
        </p>

        <div className="space-y-3 mb-6">
          {players.map((player) => (
            <button
              key={player}
              onClick={() => togglePlayer(player)}
              disabled={!selection.includes(player) && selection.length >= sizeForCurrentMission}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${selection.includes(player)
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
                ${(!selection.includes(player) && selection.length >= sizeForCurrentMission)
                  ? "opacity-50 cursor-not-allowed"
                  : ""}`}
            >
              {selection.includes(player) ? `✓ ${player} (Selected)` : player}
            </button>
          ))}
        </div>

        <button
          onClick={submitTeam}
          disabled={selection.length !== sizeForCurrentMission}
          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Propose Team ({selection.length}/{sizeForCurrentMission})
        </button>
      </div>
    </div>
  );
}
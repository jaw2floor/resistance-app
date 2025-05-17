"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import React from "react"; // Good practice to import React

export default function MissionResultPage() {
  const router = useRouter();
  const { missions } = useGame();

  // Guard clause: Handle the case where missions are not yet loaded or empty
  // This is crucial for build time prerendering and initial client-side load.
  if (!missions || missions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Mission Result</h2>
          <p className="text-xl">Loading mission results or no missions have been played yet...</p>
          <button
            onClick={() => router.push("/")} // Go back to home or a relevant page
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
          >
            Go to Lobby
          </button>
        </div>
      </div>
    );
  }

  // If we've passed the guard clause, 'missions' has at least one item.
  const currentMission = missions[missions.length - 1];

  // It's also a good idea to ensure 'currentMission' and 'currentMission.result' are what you expect,
  // though the primary check above should prevent 'currentMission' from being undefined from an empty array.
  if (!currentMission || typeof currentMission.result === 'undefined') {
      // This case handles if the mission object is malformed or result is missing unexpectedly
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Error</h2>
                  <p className="text-xl">There was an issue loading the mission result details.</p>
                  <button
                      onClick={() => router.push("/")}
                      className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150"
                  >
                      Go to Lobby
                  </button>
              </div>
          </div>
      );
  }


  const successPoints = missions.filter((m) => m.result === "success").length;
  const failPoints = missions.filter((m) => m.result === "fail").length;

  const next = () => {
    if (successPoints >= 3) {
      router.push("/game-over?winner=resistance");
    } else if (failPoints >= 3) {
      router.push("/game-over?winner=spies");
    } else {
      router.push("/select-team");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Mission {missions.length} Result</h2>
        <p className="text-xl mb-2">
          The mission was a <span className={`font-semibold ${currentMission.result === 'success' ? 'text-green-600' : 'text-red-600'}`}>{currentMission.result}!</span>
        </p>
        <p className="text-lg mb-6">
          Current Score – Resistance: <span className="font-semibold text-blue-600">{successPoints}</span>, Spies: <span className="font-semibold text-red-700">{failPoints}</span>
        </p>
        <button
          onClick={next}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
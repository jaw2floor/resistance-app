"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";

export default function Lobby() {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const router = useRouter();
  const { initializeGame } = useGame();

  const addPlayer = () => {
    if (name.trim() && players.length < 10) {
      setPlayers([...players, name.trim()]);
      setName("");
    }
  };

  const canStart = players.length >= 5 && players.length <= 10;

  const startGame = () => {
    initializeGame(players);
    router.push("/select-team");
  };

  return (
    <div className="max-w-md mx-auto space-y-4 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center">Game Lobby</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter player name"
          className="flex-1 p-2 border rounded-lg"
        />
        <button onClick={addPlayer} disabled={!name.trim() || players.length >= 10} className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50">
          Add
        </button>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {players.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      <button disabled={!canStart} className="w-full py-3 rounded-lg bg-green-500 text-white disabled:opacity-50" onClick={startGame}>
        Start Game ({players})
      </button>
      {!canStart && (
        <p className="text-sm text-gray-500">
          Need between 5 and 10 players.
        </p>
      )}
    </div>
  );
}
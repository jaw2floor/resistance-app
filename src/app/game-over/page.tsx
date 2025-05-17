"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import React, { Suspense } from "react"; // 1. Import Suspense

// 2. Create a new component for the content that uses the hooks
function GameOverContent() {
  const sp = useSearchParams();
  const winner = sp.get("winner"); // .get() returns string | null
  const { resetGame } = useGame();
  const router = useRouter();

  const restart = () => {
    resetGame();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-4">Game Over</h2>
      <p className="text-xl mb-6">
        {winner === "resistance" ? "Resistance wins!" : "Spies win!"}
      </p>
      <button
        onClick={restart}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Play Again
      </button>
    </div>
  );
}

// 3. Your default export page component now wraps GameOverContent in Suspense
export default function GameOverPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading game results...</p></div>}>
      <GameOverContent />
    </Suspense>
  );
}
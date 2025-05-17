"use client";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";

interface ClientGameOverProps {
  winner?: string;
}

export default function ClientGameOver({ winner }: ClientGameOverProps) {
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
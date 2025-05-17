"use client";
import { useGame, MissionVote } from "@/context/GameContext";
import { useRouter } from "next/navigation";

export default function VoteMissionPage() {
  const { missions, castMissionVote, nextStep } = useGame();
  const router = useRouter();
  const mission = missions.find((m, i) => i === missions.length - 1)!;

  const submitMissionVotes = () => {
    mission.team.forEach((p) => {
      const v = prompt(`${p}: success or fail?`) as MissionVote;
      castMissionVote(p, v);
    });
    nextStep();
    router.push("/mission-result");
  };

  return <button onClick={submitMissionVotes}>Submit Mission Votes</button>;
}
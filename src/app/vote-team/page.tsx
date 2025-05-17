"use client";
import { useRouter } from "next/navigation";
import { useGame, ProposalVote } from "@/context/GameContext";

export default function VoteTeamPage() {
  const { players, missions, castProposalVote, nextStep } = useGame();
  const router = useRouter();
  const mission = missions.find((m, i) => i === missions.length - 1)!;

  const submitVotes = () => {
    players.forEach((p) => {
      const vote = prompt(`${p}: approve or reject?`) as ProposalVote;
      castProposalVote(p, vote);
    });
    nextStep();
    const approves = Object.values(mission.proposalVotes).filter((v) => v === "approve").length;
    if (approves > players.length / 2) router.push("/vote-mission");
    else if (mission.proposalVotes && Object.keys(mission.proposalVotes).length === players.length && mission.proposalVotes) router.push("/select-team");
  };

  return <button onClick={submitVotes}>Cast Team Votes</button>;
}
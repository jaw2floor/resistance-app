"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type ProposalVote = "approve" | "reject";
export type MissionVote = "success" | "fail";
export type MissionResult = {
  team: string[];
  proposalVotes: Record<string, ProposalVote>;
  missionVotes?: Record<string, MissionVote>;
  result?: "success" | "fail";
};

interface GameState {
  players: string[];
  spies: string[];
  missions: MissionResult[];
  currentMission: number;
  leaderIndex: number;
  proposalCount: number;
}

interface GameContextType extends GameState {
  initializeGame: (players: string[]) => void;
  proposeTeam: (team: string[]) => void;
  castProposalVote: (player: string, vote: ProposalVote) => void;
  castMissionVote: (player: string, vote: MissionVote) => void;
  nextStep: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  players: [],
  spies: [],
  missions: [],
  currentMission: 1,
  leaderIndex: 0,
  proposalCount: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be within GameProvider");
  return ctx;
};

// team sizes per mission for 5–10 players
export const TEAM_SIZES: Record<number, number[]> = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5],
  9: [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  const initializeGame = (players: string[]) => {
    const count = players.length;
    const spiesCount = Math.ceil(count / 3);
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const spies = shuffled.slice(0, spiesCount);
    setState({ players, spies, missions: [], currentMission: 1, leaderIndex: 0, proposalCount: 0 });
  };

  const proposeTeam = (team: string[]) => {
    const mission: MissionResult = { team, proposalVotes: {} };
    const missions = [...state.missions];
    missions[state.currentMission - 1] = mission;
    setState((s) => ({ ...s, missions, proposalCount: s.proposalCount + 1 }));
  };

  const castProposalVote = (player: string, vote: ProposalVote) => {
    const missions = [...state.missions];
    const mission = missions[state.currentMission - 1];
    if (mission) {
      mission.proposalVotes[player] = vote;
      setState((s) => ({ ...s, missions }));
    }
  };

  const castMissionVote = (player: string, vote: MissionVote) => {
    const missions = [...state.missions];
    const mission = missions[state.currentMission - 1];
    if (mission) {
      mission.missionVotes = mission.missionVotes || {};
      mission.missionVotes[player] = vote;
      setState((s) => ({ ...s, missions }));
    }
  };

  const nextStep = () => {
    const ms = state.missions[state.currentMission - 1];
    // If proposal phase done?
    if (ms && Object.keys(ms.proposalVotes).length === state.players.length) {
      // tally approval
      const votes = Object.values(ms.proposalVotes);
      const approves = votes.filter((v) => v === "approve").length;
      if (approves <= state.players.length / 2) {
        // rejected
        if (state.proposalCount >= 5) {
          // spies win
          setState((s) => ({ ...s, leaderIndex: s.leaderIndex }));
          return;
        }
        // next leader, same mission
        setState((s) => ({ ...s, leaderIndex: (s.leaderIndex + 1) % s.players.length }));
        return;
      }
      // approved -> wait for mission votes
      return;
    }
    // mission votes done?
    if (ms && ms.missionVotes && Object.keys(ms.missionVotes).length === ms.team.length) {
      const failCount = Object.values(ms.missionVotes).filter((v) => v === "fail").length;
      const requiredFails = state.currentMission === 4 && state.players.length >= 7 ? 2 : 1;
      ms.result = failCount >= requiredFails ? "fail" : "success";
      const missions = [...state.missions];
      missions[state.currentMission - 1] = ms;
      // game end check
      const successPoints = missions.filter((m) => m.result === "success").length;
      const failPoints = missions.filter((m) => m.result === "fail").length;
      if (successPoints >= 3 || failPoints >= 3) {
        // game over
        setState((s) => ({ ...s, missions }));
        return;
      }
      // next mission
      setState((s) => ({
        ...s,
        missions,
        currentMission: s.currentMission + 1,
        leaderIndex: (s.leaderIndex + 1) % s.players.length,
        proposalCount: 0,
      }));
    }
  };

  const resetGame = () => setState(initialState);

  return (
    <GameContext.Provider
      value={{
        ...state,
        initializeGame,
        proposeTeam,
        castProposalVote,
        castMissionVote,
        nextStep,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
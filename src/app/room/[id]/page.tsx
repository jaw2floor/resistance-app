"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db, auth }             from "@/lib/firebase";
import {
  doc, collection, setDoc, onSnapshot,
  serverTimestamp, updateDoc, increment, deleteDoc, getDoc
} from "firebase/firestore";
import type { Player } from "@/types/firebaseModels";

export default function RoomPage({ params }: { params: { id: string } }) {
  const roomId = params.id;                // app-router style param
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [players,  setPlayers]  = useState<Player[]>([]);
  const [myName,   setMyName]   = useState("");

  /* refs & listeners */
  useEffect(() => {
    const roomRef    = doc(db, "rooms", roomId);
    const playersRef = collection(roomRef, "players");
    const meRef      = doc(playersRef, auth.currentUser!.uid);

    const unsubRoom = onSnapshot(roomRef, s =>
      setRoomName((s.data() as any)?.name ?? "")
    );
    const unsubPlayers = onSnapshot(playersRef, s =>
      setPlayers(s.docs.map(d => ({ id: d.id, ...(d.data() as Player) })))
    );

    /* clean-up on leave */
    const clean = async () => {
      if ((await getDoc(meRef)).exists()) {
        await deleteDoc(meRef);
        await updateDoc(roomRef, {
          playerCount: increment(-1),
          lastActivity: serverTimestamp(),
        });
      }
    };
    window.addEventListener("beforeunload", clean);

    return () => {
      unsubRoom(); unsubPlayers();
      window.removeEventListener("beforeunload", clean);
      clean();
    };
  }, [roomId]);

  /* join button */
  async function joinRoom() {
    if (!myName.trim()) return alert("Enter your name");
    const roomRef   = doc(db, "rooms", roomId);
    const playerRef = doc(roomRef, "players", auth.currentUser!.uid);

    await setDoc(playerRef, {
      displayName: myName.trim(),
      joinedAt: serverTimestamp(),
      isHost: false,
      isReady: false,
      role: null,
    });
    await updateDoc(roomRef, {
      playerCount: increment(1),
      lastActivity: serverTimestamp(),
    });
  }

  return (
    <main className="p-6 max-w-lg mx-auto">
      <button onClick={() => router.push("/")} className="text-blue-600">
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold mb-4">{roomName || "Room"}</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={myName}
          onChange={e => setMyName(e.target.value)}
          placeholder="Your name"
          className="flex-1 border p-2 rounded"
        />
        <button onClick={joinRoom} className="bg-green-600 text-white px-4 rounded">
          Join
        </button>
      </div>

      <h2 className="font-semibold mb-2">Players</h2>
      <ul className="space-y-1">
        {players.map(p => (
          <li key={p.id} className="border p-2 rounded">
            {p.displayName}
            {p.isHost && (
              <span className="ml-2 text-xs text-indigo-600">(host)</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

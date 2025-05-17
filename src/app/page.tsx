"use client";                           // ← NEW: mark as a Client Component
import { useEffect, useState } from "react";
import { db, auth }                    from "@/lib/firebase";
import {
  collection, query, where, orderBy,
  onSnapshot, addDoc, serverTimestamp
} from "firebase/firestore";
import { useRouter } from "next/navigation";   // ← NEW import path
import type { Room } from "@/types/firebaseModels";

export default function Lobby() {
  const [rooms, setRooms]   = useState<Room[]>([]);
  const [roomName, setRoom] = useState("");
  const router = useRouter();

  /* live rooms */
  useEffect(() => {
    const q = query(
      collection(db, "rooms"),
      where("status", "==", "lobby"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, snap =>
      setRooms(snap.docs.map(d => ({ id: d.id, ...(d.data() as Room) })))
    );
    return unsub;
  }, []);

  /* create */
  async function handleCreate() {
    if (!roomName.trim()) return alert("Type a room name");
    const docRef = await addDoc(collection(db, "rooms"), {
      name: roomName.trim(),
      status: "lobby",
      hostId: auth.currentUser?.uid ?? "",
      playerCount: 0,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    });
    router.push(`/room/${docRef.id}`);
  }

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">Resistance Rooms</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={roomName}
          onChange={e => setRoom(e.target.value)}
          placeholder="Room name"
          className="flex-1 border p-2 rounded"
        />
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 rounded">
          Create
        </button>
      </div>

      {rooms.length === 0 && <p>No open rooms yet…</p>}
      <ul className="space-y-2">
        {rooms.map(r => (
          <li
            key={r.id}
            className="border p-3 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => router.push(`/room/${r.id}`)}
          >
            <span className="font-medium">{r.name}</span>{" "}
            <span className="text-sm text-gray-500">({r.playerCount} players)</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
import { useEffect, useRef, useState, useCallback } from "react";
import { fetchRoom } from "../api/negotiation";

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

export function useNegotiationRoom(roomId) {
  const [room, setRoom] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const ws = useRef(null);

  // Load initial state via REST
  useEffect(() => {
    if (!roomId) return;
    fetchRoom(roomId).then((res) => {
      setRoom(res.data);
      setMilestones(res.data.milestones || []);
      setMessages(res.data.messages || []);
      setLoading(false);
    });
  }, [roomId]);

  // WebSocket connection
  useEffect(() => {
    if (!roomId) return;
    const token = localStorage.getItem("access");
    const socket = new WebSocket(`${WS_BASE}/ws/negotiation/${roomId}/?token=${token}`);
    ws.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);

    socket.onmessage = (e) => {
      const payload = JSON.parse(e.data);

      if (payload.type === "room.state") {
        setMilestones(payload.data.milestones);
        setMessages(payload.data.messages);
        setRoom((prev) => ({ ...prev, ...payload.data }));
        return;
      }

      if (payload.type === "chat.message") {
        setMessages((prev) => [...prev, payload.message]);
      }

      if (payload.type === "milestone.added") {
        setMilestones((prev) => [...prev, payload.milestone]);
      }

      if (payload.type === "milestone.updated") {
        setMilestones((prev) =>
          prev.map((m) => (m.id === payload.milestone.id ? payload.milestone : m))
        );
      }

      if (payload.type === "milestone.deleted") {
        setMilestones((prev) => prev.filter((m) => m.id !== payload.milestone_id));
      }

      if (payload.type === "room.confirmed") {
        setRoom((prev) => ({ ...prev, ...payload.data }));
      }
    };

    return () => socket.close();
  }, [roomId]);

  const send = useCallback((data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  const sendMessage = useCallback((content, type = "text", extra = {}) => {
    send({ type: "chat.message", message_type: type, content, ...extra });
  }, [send]);

  const addMilestone = useCallback(() => {
    send({ type: "milestone.add", title: "New Step", description: "", amount: 0, due_days: 7 });
  }, [send]);

  const updateMilestone = useCallback((milestone_id, fields) => {
    send({ type: "milestone.update", milestone_id, ...fields });
  }, [send]);

  const deleteMilestone = useCallback((milestone_id) => {
    send({ type: "milestone.delete", milestone_id });
  }, [send]);

  const confirmRoom = useCallback(() => {
    send({ type: "room.confirm" });
  }, [send]);

  return {
    room, milestones, messages, connected, loading,
    sendMessage, addMilestone, updateMilestone, deleteMilestone, confirmRoom,
  };
}

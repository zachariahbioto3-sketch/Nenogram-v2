import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNegotiationRoom } from "../../hooks/useNegotiationRoom";
import { useAuthStore } from "../../store/authStore";

export default function NegotiationRoomPage() {
  const { roomId } = useParams();
  const { user } = useAuthStore();
  const {
    room, milestones, messages, connected, loading,
    sendMessage, addMilestone, updateMilestone, deleteMilestone, confirmRoom,
  } = useNegotiationRoom(roomId);

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditFields({ title: m.title, description: m.description, amount: m.amount, due_days: m.due_days });
  };

  const saveEdit = (id) => {
    updateMilestone(id, editFields);
    setEditingId(null);
  };

  const isLocked = room?.status === "locked";
  const myConfirmed = user?.id === room?.client ? room?.client_confirmed : room?.developer_confirmed;

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-[var(--color-text-muted)]">
      Loading room...
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">

      {/* -- Left: Milestones -- */}
      <div className="w-1/2 flex flex-col border-r border-[var(--color-border)] p-4 gap-3 overflow-y-auto">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Milestones</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${connected ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {connected ? "Live" : "Disconnected"}
          </span>
        </div>

        {milestones.map((m, idx) => (
          <div key={m.id} className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)] flex flex-col gap-2">
            {editingId === m.id ? (
              <>
                <input
                  className="input text-sm"
                  value={editFields.title}
                  onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                  placeholder="Title"
                />
                <textarea
                  className="input text-sm resize-none"
                  rows={2}
                  value={editFields.description}
                  onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                  placeholder="Description"
                />
                <div className="flex gap-2">
                  <input
                    className="input text-sm w-1/2"
                    type="number"
                    value={editFields.amount}
                    onChange={(e) => setEditFields({ ...editFields, amount: e.target.value })}
                    placeholder="Amount"
                  />
                  <input
                    className="input text-sm w-1/2"
                    type="number"
                    value={editFields.due_days}
                    onChange={(e) => setEditFields({ ...editFields, due_days: e.target.value })}
                    placeholder="Days"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(m.id)} className="btn btn-primary text-xs px-3 py-1">Save</button>
                  <button onClick={() => setEditingId(null)} className="btn text-xs px-3 py-1">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-muted)]">Step {idx + 1}</span>
                  {!isLocked && (
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(m)} className="text-xs text-[var(--color-accent)] hover:underline">Edit</button>
                      <button onClick={() => deleteMilestone(m.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-[var(--color-text)]">{m.title}</p>
                {m.description && <p className="text-xs text-[var(--color-text-muted)]">{m.description}</p>}
                <div className="flex gap-4 text-xs text-[var(--color-text-muted)]">
                  <span>KES {Number(m.amount).toLocaleString()}</span>
                  <span>{m.due_days} days</span>
                </div>
              </>
            )}
          </div>
        ))}

        {!isLocked && (
          <button onClick={addMilestone} className="btn border border-dashed border-[var(--color-border)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-xl py-2">
            + Add Step
          </button>
        )}

        {/* Confirm button */}
        <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
          {isLocked ? (
            <div className="text-center text-green-400 text-sm font-medium">Contract Locked ?</div>
          ) : (
            <>
              <div className="flex gap-2 text-xs text-[var(--color-text-muted)] mb-2">
                <span className={room?.client_confirmed ? "text-green-400" : ""}>Client {room?.client_confirmed ? "?" : "pending"}</span>
                <span>·</span>
                <span className={room?.developer_confirmed ? "text-green-400" : ""}>Developer {room?.developer_confirmed ? "?" : "pending"}</span>
              </div>
              <button
                onClick={confirmRoom}
                disabled={myConfirmed}
                className={`w-full py-2 rounded-xl text-sm font-medium transition ${myConfirmed ? "bg-green-500/20 text-green-400 cursor-not-allowed" : "btn btn-primary"}`}
              >
                {myConfirmed ? "Waiting for other party..." : "Confirm & Lock Contract"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* -- Right: Chat -- */}
      <div className="w-1/2 flex flex-col">

        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
          {messages.map((msg) => {
            const isMe = msg.sender === user?.username;
            const isSystem = msg.message_type === "system";
            if (isSystem) return (
              <div key={msg.id} className="text-center text-xs text-[var(--color-text-muted)] py-1">{msg.content}</div>
            );
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${isMe ? "bg-[var(--color-accent)] text-white rounded-br-sm" : "bg-[var(--color-surface)] text-[var(--color-text)] rounded-bl-sm"}`}>
                  {!isMe && <p className="text-xs font-medium mb-1 opacity-70">{msg.sender}</p>}
                  <p>{msg.content}</p>
                  <p className="text-[10px] opacity-50 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="px-4 py-3 border-t border-[var(--color-border)] flex gap-2">
          <input
            className="input flex-1 text-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="btn btn-primary px-4 text-sm">Send</button>
        </div>
      </div>

    </div>
  );
}

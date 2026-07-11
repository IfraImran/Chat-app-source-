import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import { sendMessage } from "../lib/aiClient";

let nextId = 1;

export default function ChatApp() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg = {
      id: `m${nextId++}`,
      role: "user",
      status: "done",
      parts: [{ type: "text", text }]
    };

    const pendingId = `m${nextId++}`;
    const pendingMsg = {
      id: pendingId,
      role: "assistant",
      status: "pending",
      parts: []
    };

    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setInput("");

    try {
      const { reply } = await sendMessage(text);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, status: "done", parts: [{ type: "text", text: reply }] }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, status: "error", error: err.message }
            : m
        )
      );
    }
  }

  return (
    <main>
      <h1>Chat</h1>
      <div aria-label="Conversation">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
      </div>
      <form onSubmit={handleSend}>
        <label htmlFor="chat-input">Message</label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}

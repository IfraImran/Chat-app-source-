import React from "react";

/**
 * Renders a single chat message.
 *
 * message = {
 *   id: string,
 *   role: "user" | "assistant",
 *   status: "pending" | "streaming" | "done" | "error",
 *   error?: string,
 *   parts: Array<
 *     | { type: "text", text: string }
 *     | { type: "code", language: string, code: string }
 *     | { type: "image", src: string, alt: string }
 *   >
 * }
 */
export default function ChatMessage({ message }) {
  const { role, status, parts = [], error } = message;

  return (
    <div
      role="article"
      aria-label={`${role} message`}
      data-status={status}
      className={`chat-message chat-message--${role}`}
    >
      {status === "pending" && (
        <p role="status" aria-label="Message pending">
          Thinking…
        </p>
      )}

      {status === "streaming" && (
        <p role="status" aria-label="Message streaming">
          Typing…
        </p>
      )}

      {status === "error" && (
        <p role="alert">{error || "Something went wrong. Please try again."}</p>
      )}

      {status === "done" &&
        parts.map((part, i) => <MessagePart key={i} part={part} />)}
    </div>
  );
}

function MessagePart({ part }) {
  switch (part.type) {
    case "text":
      return <p>{part.text}</p>;
    case "code":
      return (
        <pre>
          <code aria-label={`${part.language} code snippet`}>{part.code}</code>
        </pre>
      );
    case "image":
      return <img src={part.src} alt={part.alt} />;
    default:
      return null;
  }
}

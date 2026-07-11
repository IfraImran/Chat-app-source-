/**
 * Thin wrapper around the AI backend route.
 * Kept in one place so tests can mock this module instead of
 * ever touching the real network / API.
 */
export async function sendMessage(text) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  if (!res.ok) {
    throw new Error(`AI route failed with status ${res.status}`);
  }

  return res.json(); // { reply: string }
}

export async function runTool(toolName, args) {
  const res = await fetch("/api/tools", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool: toolName, args })
  });

  if (!res.ok) {
    throw new Error(`Tool "${toolName}" failed with status ${res.status}`);
  }

  return res.json(); // { output: string }
}

import React from "react";

/**
 * result = {
 *   toolName: string,
 *   status: "loading" | "success" | "error",
 *   output?: string,
 *   error?: string
 * }
 */
export default function ToolResult({ result }) {
  const { toolName, status, output, error } = result;

  return (
    <section aria-label={`${toolName} tool result`} className="tool-result">
      <h3>{toolName}</h3>

      {status === "loading" && (
        <p role="status" aria-label={`Running ${toolName}`}>
          Running {toolName}…
        </p>
      )}

      {status === "success" && (
        <pre aria-label={`${toolName} output`}>{output}</pre>
      )}

      {status === "error" && (
        <p role="alert">{error || `${toolName} failed to run.`}</p>
      )}
    </section>
  );
}

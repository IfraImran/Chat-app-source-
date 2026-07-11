import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ToolResult from "./ToolResult";

describe("ToolResult", () => {
  it("shows a running indicator while the tool is loading", () => {
    render(
      <ToolResult result={{ toolName: "web_search", status: "loading" }} />
    );
    expect(
      screen.getByRole("status", { name: /running web_search/i })
    ).toBeInTheDocument();
  });

  it("shows the tool output once it succeeds", () => {
    render(
      <ToolResult
        result={{
          toolName: "calculator",
          status: "success",
          output: "42"
        }}
      />
    );
    expect(screen.getByLabelText(/calculator output/i)).toHaveTextContent("42");
  });

  it("surfaces an error when the tool fails", () => {
    render(
      <ToolResult
        result={{
          toolName: "file_reader",
          status: "error",
          error: "File not found"
        }}
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("File not found");
  });

  it("falls back to a generic error message when none is given", () => {
    render(<ToolResult result={{ toolName: "file_reader", status: "error" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/failed to run/i);
  });

  it("labels the whole result region by tool name for screen readers", () => {
    render(
      <ToolResult result={{ toolName: "calculator", status: "success", output: "1" }} />
    );
    expect(
      screen.getByRole("region", { name: /calculator tool result/i })
    ).toBeInTheDocument();
  });
});

import { describe, expect, it } from "vitest";
import {
  connectionScore,
  isTypeCompatible,
  listComponents,
  suggestConnections,
  validateConnection,
} from "@/lib/connection-engine";

describe("isTypeCompatible", () => {
  it("allows same types", () => {
    expect(isTypeCompatible({ key: "a", label: "A", type: "string" }, { key: "b", label: "B", type: "string" })).toBe(true);
    expect(isTypeCompatible({ key: "a", label: "A", type: "boolean" }, { key: "b", label: "B", type: "boolean" })).toBe(true);
    expect(isTypeCompatible({ key: "a", label: "A", type: "number" }, { key: "b", label: "B", type: "number" })).toBe(true);
  });

  it("rejects mismatched types", () => {
    expect(isTypeCompatible({ key: "a", label: "A", type: "string" }, { key: "b", label: "B", type: "number" })).toBe(false);
    expect(isTypeCompatible({ key: "a", label: "A", type: "boolean" }, { key: "b", label: "B", type: "string" })).toBe(false);
  });
});

describe("connectionScore", () => {
  it("returns 0 for incompatible types", () => {
    const result = connectionScore(
      { key: "value", label: "Value", type: "string" },
      { key: "count", label: "Count", type: "number" },
    );
    expect(result.score).toBe(0);
    expect(result.reason).toContain("Type mismatch");
  });

  it("returns a positive score for compatible types", () => {
    const result = connectionScore(
      { key: "count", label: "Count", type: "number" },
      { key: "total", label: "Total", type: "number" },
    );
    expect(result.score).toBeGreaterThan(0);
    expect(result.reason).toContain("number → number");
  });
});

describe("suggestConnections", () => {
  it("returns empty array for unknown source", () => {
    expect(suggestConnections("does-not-exist", [])).toEqual([]);
  });

  it("excludes self-connections and ranks by score", () => {
    const components = listComponents();
    const suggestions = suggestConnections("button", components);
    expect(suggestions.some((s) => s.sourceId === "button" && s.targetId === "button")).toBe(false);
    for (let i = 1; i < suggestions.length; i++) {
      expect(suggestions[i - 1].score).toBeGreaterThanOrEqual(suggestions[i].score);
    }
  });
});

describe("validateConnection", () => {
  it("fails for unknown source", () => {
    const result = validateConnection("missing", "value", "button", "label");
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toContain("Unknown source component");
  });

  it("fails for unknown target", () => {
    const result = validateConnection("button", "label", "missing", "value");
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toContain("Unknown target component");
  });

  it("fails for missing ports", () => {
    const result = validateConnection("button", "missing", "button", "missing");
    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes("has no port"))).toBe(true);
  });
});

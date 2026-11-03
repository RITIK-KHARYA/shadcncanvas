import { describe, expect, it } from "vitest";
import {
  formatRelativeTime,
  formatSavedStatus,
  getInitials,
  greetingForHour,
} from "@/lib/dashboard";

describe("formatRelativeTime", () => {
  it("returns Not saved yet for falsy input", () => {
    expect(formatRelativeTime(undefined as any)).toBe("Not saved yet");
    expect(formatRelativeTime(null as any)).toBe("Not saved yet");
    expect(formatRelativeTime("")).toBe("Not saved yet");
  });

  it("returns Not saved yet for invalid dates", () => {
    expect(formatRelativeTime("not-a-date")).toBe("Not saved yet");
  });

  it("returns Just now for recent timestamps", () => {
    const now = new Date();
    expect(formatRelativeTime(now.toISOString())).toBe("Just now");
  });

  it("returns minutes ago for timestamps within an hour", () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 15);
    expect(formatRelativeTime(date.toISOString())).toBe("15m ago");
  });

  it("returns hours ago for timestamps within a day", () => {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    expect(formatRelativeTime(date.toISOString())).toBe("3h ago");
  });

  it("returns days ago for timestamps within a week", () => {
    const date = new Date();
    date.setDate(date.getDate() - 2);
    expect(formatRelativeTime(date.toISOString())).toBe("2d ago");
  });
});

describe("formatSavedStatus", () => {
  it("returns Not saved yet for falsy input", () => {
    expect(formatSavedStatus(undefined as any)).toBe("Not saved yet");
    expect(formatSavedStatus(null as any)).toBe("Not saved yet");
  });

  it("returns Saved just now for very recent timestamps", () => {
    expect(formatSavedStatus(new Date().toISOString())).toBe("Saved just now");
  });

  it("returns Saved <relative> for older timestamps", () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 10);
    expect(formatSavedStatus(date.toISOString())).toBe("Saved 10m ago");
  });
});

describe("getInitials", () => {
  it("uses name when available", () => {
    expect(getInitials("Ritik Kharya")).toBe("RK");
  });

  it("falls back to email prefix", () => {
    expect(getInitials(null, "ritik@example.com")).toBe("R");
  });

  it("returns first letter of fallback when nothing is available", () => {
    expect(getInitials(null, null)).toBe("U");
  });

  it("handles hyphenated names", () => {
    expect(getInitials("Ritik-Kharya")).toBe("RK");
  });
});

describe("greetingForHour", () => {
  it("returns morning before noon", () => {
    const date = new Date("2024-01-01T08:00:00");
    date.setHours(8, 0, 0, 0);
    expect(greetingForHour(date)).toBe("Good morning");
  });

  it("returns afternoon before evening", () => {
    const date = new Date("2024-01-01T15:00:00");
    date.setHours(15, 0, 0, 0);
    expect(greetingForHour(date)).toBe("Good afternoon");
  });

  it("returns evening after 18", () => {
    const date = new Date("2024-01-01T20:00:00");
    date.setHours(20, 0, 0, 0);
    expect(greetingForHour(date)).toBe("Good evening");
  });
});

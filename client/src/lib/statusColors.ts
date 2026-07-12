// client/src/lib/statusColors.ts
//
// Single source of truth for status colour coding across the app.
// Modeled on a depot dispatch board / transit line map:
//   teal    = in service / good outcome
//   amber   = in motion right now
//   rust    = pulled in for work
//   red     = stopped / needs attention
//   slate   = neutral / not yet started
export type StatusTone = "transit" | "signal" | "rust" | "route" | "slate";

const TONE_HEX: Record<StatusTone, { fg: string; bg: string; dot: string }> = {
  transit: { fg: "#146357", bg: "#e4f3ef", dot: "#1f8a7a" },
  signal: { fg: "#8a5f14", bg: "#fbedd6", dot: "#e8a13d" },
  rust: { fg: "#7a4315", bg: "#f5e6d8", dot: "#b3651f" },
  route: { fg: "#8f2c24", bg: "#f8e2df", dot: "#c1453a" },
  slate: { fg: "#454c58", bg: "#e9e7e0", dot: "#8992a0" },
};

const STATUS_TONE: Record<string, StatusTone> = {
  // vehicles
  available: "transit",
  on_trip: "signal",
  in_shop: "rust",
  retired: "slate",
  // drivers
  off_duty: "slate",
  suspended: "route",
  // trips
  draft: "slate",
  dispatched: "signal",
  completed: "transit",
  cancelled: "route",
  // maintenance
  active: "rust",
  closed: "transit",
};

export function toneFor(status: string): StatusTone {
  return STATUS_TONE[status] ?? "slate";
}

export function colorsFor(status: string) {
  return TONE_HEX[toneFor(status)];
}

export type Theme = {
  bg: string;
  panel: string;
  border: string;
  text: string;
  muted: string;
  brand: string;
  green: string;
  greenBg: string;
  red: string;
  redBg: string;
  font: string;
};

// Salesvue's palette (blue brand accent), kept as-is for that video.
export const salesvueTheme: Theme = {
  bg: "linear-gradient(160deg, #0B1220 0%, #101B30 55%, #0B1220 100%)",
  panel: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.10)",
  text: "#F8FAFC",
  muted: "#94A3B8",
  brand: "#4F8DFD",
  green: "#34D399",
  greenBg: "rgba(52, 211, 153, 0.12)",
  red: "#FB7185",
  redBg: "rgba(251, 113, 133, 0.12)",
  font: "'Helvetica Neue', Arial, -apple-system, BlinkMacSystemFont, sans-serif",
};

// Podia's own palette (indigo/violet brand accent) - a distinct look per
// video, not a reskin of Salesvue's.
export const podiaTheme: Theme = {
  bg: "linear-gradient(160deg, #140B21 0%, #1E1230 55%, #140B21 100%)",
  panel: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.10)",
  text: "#F8FAFC",
  muted: "#A599B5",
  brand: "#A78BFA",
  green: "#34D399",
  greenBg: "rgba(52, 211, 153, 0.12)",
  red: "#FB7185",
  redBg: "rgba(251, 113, 133, 0.12)",
  font: "'Helvetica Neue', Arial, -apple-system, BlinkMacSystemFont, sans-serif",
};

import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimelineHelpers } from "./timeline";
import type { Theme } from "./theme";

// A handful of off-center positions so consecutive pops don't stack in the
// same spot - deterministic per occurrence (not random per frame).
const POSITIONS = [
  { top: "22%", left: "50%", rotate: -3 },
  { top: "68%", left: "50%", rotate: 2 },
  { top: "30%", left: "28%", rotate: -2 },
  { top: "30%", left: "72%", rotate: 3 },
];

const hashIndex = (text: string, mod: number): number => {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h % mod;
};

// Big, bold, single-word/short-phrase pop-in - our own version of the
// "impact caption" technique (not a copy of any specific video's colors or
// font). Only lines tagged with a `keyword` in script.json trigger this;
// everything else just gets the sentence-level Captions bar.
export const KeywordPop: React.FC<{ timeline: TimelineHelpers; theme: Theme }> = ({ timeline, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const active = timeline.lines.find((l) => l.keyword && t >= l.start && t < l.end);
  if (!active || !active.keyword) return null;

  const localT = t - active.start;
  const popDuration = Math.min(1.1, active.end - active.start);

  const scale = interpolate(localT, [0, 0.12, popDuration - 0.25, popDuration], [0.6, 1.08, 1, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(localT, [0, 0.1, popDuration - 0.2, popDuration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (opacity <= 0) return null;

  const pos = POSITIONS[hashIndex(active.keyword, POSITIONS.length)];

  return (
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${pos.rotate}deg)`,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: theme.font,
          fontSize: 76,
          fontWeight: 800,
          color: theme.text,
          background: theme.brand,
          padding: "10px 30px",
          borderRadius: 12,
          whiteSpace: "nowrap",
          boxShadow: `0 0 60px ${theme.brand}66`,
        }}
      >
        {active.keyword}
      </div>
    </div>
  );
};

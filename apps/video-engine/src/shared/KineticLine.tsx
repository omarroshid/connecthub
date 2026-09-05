import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimelineHelpers } from "./timeline";
import type { Theme } from "./theme";

// Swaps in the current line's full text, big and bold, re-animating every
// time the active line changes. Since hook/CTA lines are short (2-3s each),
// this alone produces the "fast cut" energy of the hook montage - no manual
// per-line Sequence editing needed, it just follows the narration timeline.
export const KineticLine: React.FC<{
  timeline: TimelineHelpers;
  theme: Theme;
  sectionName: string;
  fontSize?: number;
}> = ({ timeline, theme, sectionName, fontSize = 58 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const section = timeline.getSection(sectionName);
  // A line's active window is extended to the next line's start (or the
  // section's own end for the last line) so it holds - rather than fading to
  // black - through the brief silence gap between spoken lines. Only the
  // very last line fades out, since there's nothing to hard-cut to after it.
  const index = section.lines.findIndex((l, i) => {
    const windowEnd = i + 1 < section.lines.length ? section.lines[i + 1].start : section.end;
    return t >= l.start && t < windowEnd;
  });
  if (index === -1) return null;
  const active = section.lines[index];
  const isLast = index === section.lines.length - 1;

  const localT = t - active.start;
  const dur = active.end - active.start;
  const scale = interpolate(localT, [0, 0.25], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const translateY = interpolate(localT, [0, 0.25], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeIn = interpolate(localT, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = isLast
    ? interpolate(localT, [Math.max(dur - 0.2, 0), dur], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 1500,
          padding: "0 80px",
          textAlign: "center",
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
        }}
      >
        <div style={{ fontFamily: theme.font, fontSize, fontWeight: 800, color: theme.text, lineHeight: 1.25 }}>
          {active.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

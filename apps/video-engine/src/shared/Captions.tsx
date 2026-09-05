import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimelineHelpers } from "./timeline";
import type { Theme } from "./theme";

// Full-sentence caption bar anchored at the bottom, showing whatever line is
// currently being spoken. Used for the calmer explanation sections; the
// hook/CTA use HookLine's bigger kinetic text instead.
export const Captions: React.FC<{ timeline: TimelineHelpers; theme: Theme; hideForSections?: string[] }> = ({
  timeline,
  theme,
  hideForSections = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Extend each line's active window to the next line's start so the bar
  // holds - rather than blinking to blank - through the brief silence gap
  // between spoken lines; only the very last line in the video fades out.
  const lines = timeline.lines;
  const index = lines.findIndex((l, i) => {
    const windowEnd = i + 1 < lines.length ? lines[i + 1].start : l.end;
    return t >= l.start && t < windowEnd;
  });
  if (index === -1) return null;
  const active = lines[index];
  if (hideForSections.includes(active.section)) return null;
  // A keyword-pop is carrying this exact moment (big text, center-ish) -
  // showing the same words again in the small bottom bar is a duplicate the
  // viewer reads twice. Suppress the caption for that line's span instead.
  if (active.keyword) return null;
  const isLast = index === lines.length - 1;

  const localT = t - active.start;
  const dur = active.end - active.start;
  const fadeIn = interpolate(localT, [0, 0.15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = isLast
    ? interpolate(localT, [Math.max(dur - 0.15, 0), dur], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          padding: "16px 40px",
          borderRadius: 14,
          background: "rgba(6, 10, 20, 0.8)",
          color: theme.text,
          fontSize: 36,
          fontWeight: 600,
          textAlign: "center",
          fontFamily: theme.font,
          lineHeight: 1.3,
        }}
      >
        {active.text}
      </div>
    </div>
  );
};

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { podiaTheme as theme } from "../shared/theme";
import type { TimelineHelpers } from "../shared/timeline";

export const VerdictScene: React.FC<{ timeline: TimelineHelpers }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const section = timeline.getSection("verdict");
  const line1Start = Math.round((section.lines[1].start - section.start) * fps);
  const line2Start = Math.round((section.lines[2].start - section.start) * fps);

  const fadeUp = (startFrame: number) => {
    const local = frame - startFrame;
    const opacity = interpolate(local, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const translateY = interpolate(local, [0, fps * 0.5], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { opacity, transform: `translateY(${translateY}px)` };
  };

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 1300 }}>
        <div style={{ fontSize: 60, marginBottom: 20, ...fadeUp(0) }}>⚖️</div>
        <div style={{ fontFamily: theme.font, fontSize: 56, fontWeight: 800, color: theme.text, ...fadeUp(0) }}>
          Is Podia worth it?
        </div>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 28,
            fontWeight: 500,
            color: theme.muted,
            marginTop: 30,
            lineHeight: 1.5,
            ...fadeUp(line1Start),
          }}
        >
          A genuinely solid all-in-one option if you value simplicity over every
          advanced feature, and you're ready to commit to a paid plan.
        </div>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 24,
            fontWeight: 600,
            color: theme.brand,
            marginTop: 24,
            ...fadeUp(line2Start),
          }}
        >
          Not the cheapest start, not the most powerful for marketing — but a
          strong shortlist pick for course + community + email in one place.
        </div>
      </div>
    </AbsoluteFill>
  );
};

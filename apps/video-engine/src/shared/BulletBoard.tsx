import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimelineHelpers } from "./timeline";
import type { Theme } from "./theme";

export const BulletBoard: React.FC<{
  timeline: TimelineHelpers;
  theme: Theme;
  sectionName: string;
  heading: string;
  color: string;
  bgColor: string;
  icon: string;
}> = ({ timeline, theme, sectionName, heading, color, bgColor, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const section = timeline.getSection(sectionName);
  const starts = timeline.bulletStarts(sectionName);
  const labels = timeline.bulletLabels(sectionName);
  const bulletNumbers = Object.keys(starts)
    .map(Number)
    .sort((a, b) => a - b);
  const secondsToFrames = (s: number) => Math.round(s * fps);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 70,
          fontFamily: theme.font,
          fontSize: 42,
          fontWeight: 800,
          color,
          letterSpacing: 3,
        }}
      >
        {heading}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 1560 }}>
        {bulletNumbers.map((n) => {
          const startFrame = secondsToFrames(starts[n] - section.start);
          const local = frame - startFrame;
          const revealed = local >= 0;
          const opacity = revealed
            ? interpolate(local, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" })
            : 0;
          const translateX = revealed
            ? interpolate(local, [0, fps * 0.4], [-30, 0], { extrapolateRight: "clamp" })
            : -30;
          const isCurrent = revealed && local < fps * 1.6;

          return (
            <div
              key={n}
              style={{
                opacity,
                transform: `translateX(${translateX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 22,
                background: bgColor,
                border: `2px solid ${isCurrent ? color : theme.border}`,
                borderRadius: 18,
                padding: "28px 34px",
                minWidth: 600,
                boxShadow: isCurrent ? `0 0 44px ${color}55` : "none",
              }}
            >
              <div style={{ fontSize: 42 }}>{icon}</div>
              <div style={{ fontFamily: theme.font, fontSize: 30, fontWeight: 700, color: theme.text }}>
                {labels[n]}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

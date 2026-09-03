import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { bulletLabels, bulletStarts, getSection, secondsToFrames } from "./timeline";

export const BulletBoard: React.FC<{
  sectionName: string;
  heading: string;
  color: string;
  bgColor: string;
  icon: string;
}> = ({ sectionName, heading, color, bgColor, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const section = getSection(sectionName);
  const starts = bulletStarts(sectionName);
  const labels = bulletLabels(sectionName);
  const bulletNumbers = Object.keys(starts)
    .map(Number)
    .sort((a, b) => a - b);

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          maxWidth: 1560,
        }}
      >
        {bulletNumbers.map((n) => {
          const startFrame = secondsToFrames(starts[n] - section.start, fps);
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
              <div
                style={{
                  fontFamily: theme.font,
                  fontSize: 30,
                  fontWeight: 700,
                  color: theme.text,
                }}
              >
                {labels[n]}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

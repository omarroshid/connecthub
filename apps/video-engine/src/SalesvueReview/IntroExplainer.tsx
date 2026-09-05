import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { getSection, secondsToFrames } from "./timeline";

const fadeUp = (frame: number, startFrame: number, fps: number) => {
  const local = frame - startFrame;
  const opacity = interpolate(local, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(local, [0, fps * 0.5], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `translateY(${translateY}px)` };
};

const Chip: React.FC<{ emoji: string; label: string }> = ({ emoji, label }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      background: theme.panel,
      border: `1px solid ${theme.border}`,
      borderRadius: 20,
      padding: "24px 34px",
    }}
  >
    <div style={{ fontSize: 44 }}>{emoji}</div>
    <div style={{ fontFamily: theme.font, fontSize: 26, color: theme.text, fontWeight: 600 }}>
      {label}
    </div>
  </div>
);

export const IntroExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const introSection = getSection("intro");

  const descLine = introSection.lines[2];
  const chipsLine = introSection.lines[3];
  const descStart = secondsToFrames(descLine.start - introSection.start, fps);
  const chipsStart = secondsToFrames(chipsLine.start - introSection.start, fps);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 1400 }}>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 68,
            fontWeight: 800,
            color: theme.text,
            ...fadeUp(frame, 0, fps),
          }}
        >
          What is Salesvue?
        </div>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 32,
            color: theme.muted,
            marginTop: 22,
            fontWeight: 500,
            ...fadeUp(frame, descStart, fps),
          }}
        >
          A sales engagement &amp; dialer platform built natively inside Salesforce
        </div>
        <div
          style={{
            display: "flex",
            gap: 28,
            marginTop: 56,
            justifyContent: "center",
            ...fadeUp(frame, chipsStart, fps),
          }}
        >
          <Chip emoji="☁️" label="Salesforce" />
          <Chip emoji="📞" label="Calls" />
          <Chip emoji="✉️" label="Emails" />
          <Chip emoji="✅" label="Tasks" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

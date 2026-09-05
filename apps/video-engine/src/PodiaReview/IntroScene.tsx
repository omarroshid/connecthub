import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { podiaTheme as theme } from "../shared/theme";
import type { TimelineHelpers } from "../shared/timeline";

const fadeUp = (frame: number, startFrame: number, fps: number) => {
  const local = frame - startFrame;
  const opacity = interpolate(local, [0, fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const translateY = interpolate(local, [0, fps * 0.5], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
      padding: "24px 30px",
    }}
  >
    <div style={{ fontSize: 40 }}>{emoji}</div>
    <div style={{ fontFamily: theme.font, fontSize: 22, color: theme.text, fontWeight: 600 }}>{label}</div>
  </div>
);

export const IntroScene: React.FC<{ timeline: TimelineHelpers }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const section = timeline.getSection("intro");

  const descLine = section.lines[1];
  const chipsLine = section.lines[2];
  const descStart = Math.round((descLine.start - section.start) * fps);
  const chipsStart = Math.round((chipsLine.start - section.start) * fps);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 1450 }}>
        <div style={{ fontFamily: theme.font, fontSize: 66, fontWeight: 800, color: theme.text, ...fadeUp(frame, 0, fps) }}>
          What is Podia?
        </div>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 30,
            color: theme.muted,
            marginTop: 20,
            fontWeight: 500,
            ...fadeUp(frame, descStart, fps),
          }}
        >
          An all-in-one platform for creators: courses, coaching, memberships &amp; downloads
        </div>
        <div style={{ display: "flex", gap: 26, marginTop: 50, justifyContent: "center", ...fadeUp(frame, chipsStart, fps) }}>
          <Chip emoji="🎓" label="Courses" />
          <Chip emoji="👥" label="Community" />
          <Chip emoji="✉️" label="Email" />
          <Chip emoji="🌐" label="Website" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

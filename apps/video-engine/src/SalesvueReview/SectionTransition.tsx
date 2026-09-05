import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

export const SectionTransition: React.FC<{
  label: string;
  emoji: string;
  color: string;
}> = ({ label, emoji, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const sweep = interpolate(frame, [0, fps * 0.4], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}22 0%, transparent ${sweep}%)`,
        }}
      />
      <div
        style={{
          transform: `scale(${scale})`,
          display: "flex",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div style={{ fontSize: 100 }}>{emoji}</div>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 140,
            fontWeight: 800,
            color,
            letterSpacing: 6,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

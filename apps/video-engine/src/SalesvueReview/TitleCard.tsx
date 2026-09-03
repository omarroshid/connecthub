import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 120,
            fontWeight: 800,
            color: theme.text,
            letterSpacing: 4,
          }}
        >
          SALES<span style={{ color: theme.blue }}>VUE</span>
        </div>
        <div
          style={{
            width: 220,
            height: 6,
            background: theme.blue,
            margin: "18px auto 30px",
            borderRadius: 3,
          }}
        />
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 46,
            fontWeight: 600,
            color: theme.text,
          }}
        >
          Review: Pros &amp; Cons
        </div>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 30,
            fontWeight: 500,
            color: theme.muted,
            marginTop: 14,
          }}
        >
          Watch before using ⚠️
        </div>
      </div>
    </AbsoluteFill>
  );
};

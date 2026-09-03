import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { lines } from "./timeline";
import { theme } from "./theme";

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const active = lines.find((l) => t >= l.start && t < l.end);
  if (!active) return null;

  const localT = t - active.start;
  const dur = active.end - active.start;
  const fadeIn = interpolate(localT, [0, 0.15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(localT, [Math.max(dur - 0.15, 0), dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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

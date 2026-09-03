import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { getSection, secondsToFrames } from "./timeline";

const RecapChip: React.FC<{ color: string; bgColor: string; text: string }> = ({
  color,
  bgColor,
  text,
}) => (
  <div
    style={{
      background: bgColor,
      border: `1px solid ${color}`,
      borderRadius: 12,
      padding: "10px 18px",
      fontFamily: theme.font,
      fontSize: 20,
      fontWeight: 700,
      color: theme.text,
    }}
  >
    {text}
  </div>
);

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const section = getSection("outro");
  const sectionFrames = secondsToFrames(section.end - section.start, fps);

  const recapStart = secondsToFrames(section.lines[1].start - section.start, fps);
  const ctaStart = secondsToFrames(section.lines[3].start - section.start, fps);

  const fadeIn = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [sectionFrames - 20, sectionFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const recapOpacity =
    frame >= recapStart
      ? interpolate(frame - recapStart, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" })
      : 0;
  const ctaOpacity =
    frame >= ctaStart
      ? interpolate(frame - ctaStart, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" })
      : 0;

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", opacity: Math.min(fadeIn, fadeOut) }}
    >
      <div style={{ textAlign: "center", maxWidth: 1400 }}>
        <div style={{ fontFamily: theme.font, fontSize: 64, fontWeight: 800, color: theme.text }}>
          Thanks for Watching! 🙌
        </div>

        <div style={{ display: "flex", gap: 40, marginTop: 44, opacity: recapOpacity }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontFamily: theme.font, color: theme.green, fontWeight: 800, fontSize: 22 }}>
              PROS
            </div>
            <RecapChip color={theme.green} bgColor={theme.greenBg} text="100% native to Salesforce" />
            <RecapChip color={theme.green} bgColor={theme.greenBg} text="Multi-channel cadences" />
            <RecapChip color={theme.green} bgColor={theme.greenBg} text="Native reporting & dashboards" />
            <RecapChip color={theme.green} bgColor={theme.greenBg} text="Deep admin customization" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontFamily: theme.font, color: theme.red, fontWeight: 800, fontSize: 22 }}>
              CONS
            </div>
            <RecapChip color={theme.red} bgColor={theme.redBg} text="Salesforce-only" />
            <RecapChip color={theme.red} bgColor={theme.redBg} text="Pricing isn't public" />
            <RecapChip color={theme.red} bgColor={theme.redBg} text="Interface feels utilitarian" />
            <RecapChip color={theme.red} bgColor={theme.redBg} text="Real setup & admin time" />
          </div>
        </div>

        <div
          style={{
            fontFamily: theme.font,
            fontSize: 28,
            fontWeight: 600,
            color: theme.muted,
            marginTop: 40,
            opacity: ctaOpacity,
          }}
        >
          Do your own demo before you commit.
        </div>
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { getSection, secondsToFrames } from "./timeline";

const Column: React.FC<{
  frame: number;
  startFrame: number;
  fps: number;
  color: string;
  bgColor: string;
  emoji: string;
  title: string;
  body: string;
}> = ({ frame, startFrame, fps, color, bgColor, emoji, title, body }) => {
  const local = frame - startFrame;
  const revealed = local >= 0;
  const opacity = revealed
    ? interpolate(local, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" })
    : 0;
  const translateY = revealed
    ? interpolate(local, [0, fps * 0.5], [24, 0], { extrapolateRight: "clamp" })
    : 24;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: bgColor,
        border: `2px solid ${color}`,
        borderRadius: 22,
        padding: "36px 38px",
        width: 620,
      }}
    >
      <div style={{ fontSize: 46, marginBottom: 14 }}>{emoji}</div>
      <div
        style={{
          fontFamily: theme.font,
          fontSize: 32,
          fontWeight: 800,
          color,
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: theme.font,
          fontSize: 24,
          fontWeight: 500,
          color: theme.text,
          lineHeight: 1.4,
        }}
      >
        {body}
      </div>
    </div>
  );
};

export const Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const section = getSection("verdict");
  const fitStart = secondsToFrames(section.lines[1].start - section.start, fps);
  const elseStart = secondsToFrames(section.lines[2].start - section.start, fps);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 70,
          fontFamily: theme.font,
          fontSize: 52,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        Who is Salesvue for?
      </div>
      <div style={{ display: "flex", gap: 36 }}>
        <Column
          frame={frame}
          startFrame={fitStart}
          fps={fps}
          color={theme.green}
          bgColor={theme.greenBg}
          emoji="✅"
          title="Great fit if..."
          body="Your whole sales org already lives in Salesforce and you want native reporting without a second system."
        />
        <Column
          frame={frame}
          startFrame={elseStart}
          fps={fps}
          color={theme.red}
          bgColor={theme.redBg}
          emoji="🚩"
          title="Look elsewhere if..."
          body="You're not on Salesforce, or you want a flashier out-of-the-box tool."
        />
      </div>
    </AbsoluteFill>
  );
};

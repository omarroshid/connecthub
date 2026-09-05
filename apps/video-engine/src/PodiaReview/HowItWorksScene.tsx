import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { podiaTheme as theme } from "../shared/theme";
import type { TimelineHelpers } from "../shared/timeline";

const STEPS = [
  { emoji: "🖱️", title: "Build your site", sub: "Drag & drop, no code" },
  { emoji: "🎬", title: "Add your course", sub: "Video, quizzes, drip content" },
  { emoji: "📅", title: "Run live events", sub: "Zoom, Meet, YouTube Live" },
  { emoji: "✉️", title: "Send emails", sub: "Newsletters & automations" },
];

export const HowItWorksScene: React.FC<{ timeline: TimelineHelpers }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const section = timeline.getSection("how-it-works");
  // lines[0] is the intro line ("Here's what actually using it looks like");
  // lines[1..4] each correspond 1:1 to a step above.
  const stepStarts = section.lines.slice(1, 5).map((l) => Math.round((l.start - section.start) * fps));

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 70,
          fontFamily: theme.font,
          fontSize: 42,
          fontWeight: 800,
          color: theme.brand,
          letterSpacing: 2,
        }}
      >
        HOW IT WORKS
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 900 }}>
        {STEPS.map((step, i) => {
          const startFrame = stepStarts[i] ?? 0;
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
              key={step.title}
              style={{
                opacity,
                transform: `translateX(${translateX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 24,
                background: theme.panel,
                border: `2px solid ${isCurrent ? theme.brand : theme.border}`,
                borderRadius: 18,
                padding: "20px 30px",
                boxShadow: isCurrent ? `0 0 40px ${theme.brand}55` : "none",
              }}
            >
              <div style={{ fontSize: 40 }}>{step.emoji}</div>
              <div>
                <div style={{ fontFamily: theme.font, fontSize: 28, fontWeight: 700, color: theme.text }}>
                  {step.title}
                </div>
                <div style={{ fontFamily: theme.font, fontSize: 20, fontWeight: 500, color: theme.muted }}>
                  {step.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

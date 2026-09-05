import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Theme } from "./theme";

export type BackgroundKind = "content" | "energetic" | "transition";

// Each section "mode" gets its own visual treatment so the viewer
// subconsciously reads where they are in the video - a calm gradient for
// explanation, an energetic animated wash for the hook/CTA, and a moving
// perspective grid for section-transition title cards. This is our own CSS
// recreation of that idea, not a copy of any reference video's specific
// assets, colors, or exact motion.
export const SectionBackground: React.FC<{ kind: BackgroundKind; theme: Theme }> = ({ kind, theme }) => {
  const frame = useCurrentFrame();

  if (kind === "content") {
    return <AbsoluteFill style={{ background: theme.bg }} />;
  }

  if (kind === "energetic") {
    const angle = (frame * 0.6) % 360;
    return (
      <AbsoluteFill
        style={{
          background: `conic-gradient(from ${angle}deg at 30% 40%, ${theme.brand}55, #0B1220 35%, ${theme.green}33 60%, #0B1220 85%, ${theme.brand}55)`,
        }}
      >
        <AbsoluteFill style={{ background: "rgba(10, 8, 18, 0.55)", backdropFilter: "blur(2px)" }} />
      </AbsoluteFill>
    );
  }

  // "transition": a slowly-scrolling perspective grid, evoking motion
  // between sections without needing any external asset.
  const scroll = (frame * 2) % 80;
  const gridLine = `repeating-linear-gradient(0deg, transparent 0 78px, ${theme.border} 78px 80px)`;
  const gridLineV = `repeating-linear-gradient(90deg, transparent 0 78px, ${theme.border} 78px 80px)`;
  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: "-50% -50%",
          backgroundImage: `${gridLine}, ${gridLineV}`,
          backgroundPosition: `0 ${scroll}px, 0 0`,
          transform: "perspective(500px) rotateX(55deg)",
          transformOrigin: "center",
        }}
      />
    </AbsoluteFill>
  );
};

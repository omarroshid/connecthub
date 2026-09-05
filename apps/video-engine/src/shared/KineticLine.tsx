import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimelineHelpers } from "./timeline";
import type { Theme } from "./theme";
import { useFadeRise, useSpringIn, useChoreographedExit } from "./motion";

// Swaps in the current line's full text, big and bold, re-animating every
// time the active line changes. Since hook/CTA lines are short (2-3s each),
// this alone produces the "fast cut" energy of the hook montage - no manual
// per-line Sequence editing needed, it just follows the narration timeline.
export const KineticLine: React.FC<{
  timeline: TimelineHelpers;
  theme: Theme;
  sectionName: string;
  fontSize?: number;
}> = ({ timeline, theme, sectionName, fontSize = 58 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const section = timeline.getSection(sectionName);
  // A line's active window is extended to the next line's start (or the
  // section's own end for the last line) so it holds - rather than fading to
  // black - through the brief silence gap between spoken lines. Only the
  // very last line fades out, since there's nothing to hard-cut to after it.
  const index = section.lines.findIndex((l, i) => {
    const windowEnd = i + 1 < section.lines.length ? section.lines[i + 1].start : section.end;
    return t >= l.start && t < windowEnd;
  });
  const active = index === -1 ? undefined : section.lines[index];
  const isLast = index === section.lines.length - 1;

  // Hooks run unconditionally (rules of hooks) with a safe fallback start
  // time; the null-check happens after, when we decide whether to render.
  const { opacity: fadeInOpacity, ty } = useFadeRise(active?.start ?? 0, 0.3, 24);
  const scale = useSpringIn(active?.start ?? 0, 0.3);
  const dur = active ? active.end - active.start : 0;
  const exit = useChoreographedExit(active ? active.start + Math.max(dur - 0.2, 0) : 0, 0.2);
  const opacity = isLast ? Math.min(fadeInOpacity, exit.opacity) : fadeInOpacity;

  if (!active) return null;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 1500,
          padding: "0 80px",
          textAlign: "center",
          opacity,
          filter: isLast && exit.blur > 0.1 ? `blur(${exit.blur}px)` : undefined,
          transform: `translateY(${ty + (isLast ? exit.ty : 0)}px) scale(${scale * (isLast ? exit.scale : 1)})`,
        }}
      >
        <div style={{ fontFamily: theme.font, fontSize, fontWeight: 800, color: theme.text, lineHeight: 1.25 }}>
          {active.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

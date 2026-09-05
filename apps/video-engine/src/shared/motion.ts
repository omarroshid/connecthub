import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Shared cinematic motion vocabulary, adapted from a third-party video-editing
 * skill's `motion.ts` (see docs/video-production/EDITING_STYLE.md for the
 * source and what else was adapted from it). Every template should reach for
 * these instead of hand-rolling its own interpolate() calls, so an entrance
 * or exit feels the same everywhere in the video.
 *
 * All `startSec`/`exitStartSec` args are compared against useCurrentFrame(),
 * so they must be in the same time-base the caller is already using
 * (absolute composition time for a component mounted at the composition
 * root; Sequence-local time for one mounted inside a <Sequence>).
 */

/** Fast attack, long graceful settle. Use for anything entering the frame. */
export const ENTRANCE_EASE = Easing.bezier(0.16, 1, 0.3, 1);
/** Hangs, then snaps away. Use for anything leaving the frame. */
export const EXIT_EASE = Easing.bezier(0.7, 0, 0.84, 0);
/** Material-standard ease — general-purpose fallback. */
export const STANDARD_EASE = Easing.bezier(0.4, 0, 0.2, 1);
/** Smooth slow-out — sustained motion (settle zoom, slow drifts). */
export const SMOOTH_EASE = Easing.bezier(0.25, 0.1, 0.25, 1);

/**
 * The dimension typography should anchor on: `width` in portrait, `height`
 * in landscape. A font sized off the wrong axis looks balanced in one
 * orientation and oversized/undersized in the other.
 */
export const useTypeBase = (): number => {
  const { width, height } = useVideoConfig();
  return Math.min(width, height);
};

/** Fade in over `durSec` while drifting up from `riseY` pixels. */
export const useFadeRise = (
  startSec: number,
  durSec: number = 0.5,
  riseY: number = 16,
): { opacity: number; ty: number } => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const startFrame = Math.round(startSec * fps);
  const dur = Math.round(durSec * fps);
  const k = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: STANDARD_EASE,
  });
  return { opacity: k, ty: interpolate(k, [0, 1], [riseY, 0]) };
};

/** Subtle spring entrance (0→1) — less bouncy than a default spring. */
export const useSpringIn = (startSec: number, durSec: number = 0.55): number => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const startFrame = Math.round(startSec * fps);
  return spring({
    frame: frame - startFrame,
    fps,
    durationInFrames: Math.round(durSec * fps),
    config: { damping: 18, stiffness: 120, mass: 0.7 },
  });
};

/** Scale punch for an emphasized element: overshoots then rests slightly above 1.0. */
export const useEmphasisPunch = (
  startSec: number,
  durSec: number = 0.55,
  rest: number = 1.06,
): number => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({
    frame: frame - Math.round(startSec * fps),
    fps,
    durationInFrames: Math.max(1, Math.round(durSec * fps)),
    config: { damping: 11, stiffness: 170, mass: 0.7 },
  });
  return interpolate(s, [0, 1], [0.9, rest]);
};

/**
 * Choreographed exit: dissolve-forward (scale up a touch, blur out, fade,
 * drift up) instead of a hard cut. `exitStartSec` is when the exit begins.
 */
export const useChoreographedExit = (
  exitStartSec: number,
  durSec: number = 0.45,
): { opacity: number; ty: number; blur: number; scale: number } => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const startFrame = Math.round(exitStartSec * fps);
  const dur = Math.max(1, Math.round(durSec * fps));
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EXIT_EASE,
  });
  return { opacity: 1 - p, ty: -p * 14, blur: p * 10, scale: 1 + p * 0.04 };
};

/** Slow continuous drift+scale so a sustained hold never reads as a frozen frame. */
export const useLivingHold = (
  startSec: number,
  durSec: number = 4,
  maxScale: number = 1.02,
  driftPx: number = -8,
): { scale: number; ty: number } => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const startFrame = Math.round(startSec * fps);
  const dur = Math.max(1, Math.round(durSec * fps));
  const k = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SMOOTH_EASE,
  });
  return { scale: 1 + (maxScale - 1) * k, ty: driftPx * k };
};

/** Reading-time floor for a text-bearing card: comfortable on-screen scan speed. */
export const readingDurationSec = (charCount: number, dwellSec: number = 1.5): number =>
  Math.max(3.5, charCount / 12 + dwellSec);

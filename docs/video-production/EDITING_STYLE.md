# Editing style — rules adapted from a third-party video-editing skill

The user shared a mature, battle-tested Claude Code skill ("video-edit", built
by Luuk Alleman for his BuildLoop channel) that edits **pre-cut real-speaker
footage** — adding b-roll, captions, zoom/follow-cam, music, and SFX over a
filmed talking-head video via WhisperX + a Python pipeline + a 30+ component
Remotion template library.

**Our pipeline generates the whole video from nothing** (TTS narration +
motion graphics, no camera footage) — so most of that skill doesn't transfer
literally. What follows is the part that *does* transfer: rules and code that
are really about pacing, legibility, and motion design in general, not about
compositing over footage. Full source skill available on request if any of
this needs revisiting against the original.

## Motion vocabulary — `src/shared/motion.ts`

Adapted directly (same easing curves, same hook shapes). Use these instead of
hand-rolling a fresh `interpolate()` call in every component:

- `ENTRANCE_EASE` / `EXIT_EASE` — fast-attack-long-settle for anything
  entering, hangs-then-snaps for anything leaving. Two curves, used
  everywhere, so every entrance/exit in the video feels like the same hand
  animated it.
- `useFadeRise`, `useSpringIn` — standard entrances.
- `useEmphasisPunch` — spring overshoot for a word/phrase that should read
  bigger than its neighbors (used by `KeywordPop`).
- `useChoreographedExit` — dissolve-forward (scale up + blur + fade + drift)
  instead of a hard cut (used by `KeywordPop` and the last line of
  `KineticLine`).
- `useLivingHold` — slow continuous drift so a long static hold never reads
  as a frozen frame. Not wired up anywhere yet — reach for it if a future
  scene has a long single-card hold (>4s) that feels dead.
- `readingDurationSec(charCount)` — reading-time floor for text-bearing
  cards: `max(3.5s, charCount/12 + 1.5s dwell)`. Not enforced yet (our beats
  are timed to speech, not hand-authored durations), but useful as a sanity
  check if a card feels rushed or draggy.

## Rules adopted (adapted to our context)

- **One accent color per frame.** Already true of our per-video theme
  (`green` for pros, `red` for cons, `brand` for everything else) — kept as
  an explicit rule going forward, not just an accident of the palette.
- **Captions and a keyword-pop never show the same words at once.**
  `Captions.tsx` now suppresses the bottom bar for any line that also
  triggers `KeywordPop` — showing the sentence small at the bottom while the
  same words are popping big in the middle read as duplicated text.
- **The "muted viewer" test for every visual.** Before adding a caption
  label, bullet, or on-screen graphic: if a viewer paused the frame and read
  only what's on screen, would it match the exact claim being spoken at that
  moment? If it's vaguely-related-but-different, cut it.
- **Density has a ceiling.** The source skill caps visual events at ≤4 per
  12-second window. Ours is naturally sparser (one scene per topic beat), but
  if a future video's script starts stacking keyword-pops, bullet reveals,
  and section transitions within a few seconds of each other, thin it out
  rather than showing everything at once.
- **A hook must earn its own render — never generic "vibes."** Every visual
  needs a one-sentence reason tying it to the exact word/claim on screen at
  that moment. This is why our `keyword` tags live on specific script lines
  rather than being sprinkled decoratively.

## What was deliberately NOT adopted

- The whole b-roll/WhisperX/follow-cam/subscribe-bug pipeline — built for
  compositing over real footage we don't have.
- Their brand assets (`assets/logos/`, `assets/subscribe-bug.mp4`) — the
  subscribe bug specifically is another creator's own channel branding (name,
  subscriber count) and must never appear in our output.
- Their color system (raisin black `#0F121A` + neo-lime `#CFFF05`) — that's
  their brand, not ours; each of our videos gets its own palette
  (`src/shared/theme.ts`).

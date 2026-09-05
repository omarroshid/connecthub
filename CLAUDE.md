# connecthub

Monorepo for the Somali Cameo-style app (`apps/web`, `apps/mobile`,
`apps/api`, `packages/*`) plus an AI video-editing engine
(`apps/video-engine`, `apps/transcription`).

## Product review videos

Every product review video (Salesvue, Wordtune, and future ones) must follow
the standing framework in [`docs/video-production/`](docs/video-production/):

- `SCRIPT_FRAMEWORK.md` — the required 8-section scriptwriting structure.
  **Hard rule: never draft a script without both the exact video title and
  the official product website link** — ask for whichever is missing rather
  than inventing product details.
- `VOICE_PROFILE.md` — the standard calibrated narration voice (eSpeak NG
  parameters matched to a user-provided reference voiceover sample).
- `EDITING_STYLE.md` — motion/pacing rules adapted from a third-party
  video-editing skill, plus the shared motion vocabulary in
  `apps/video-engine/src/shared/motion.ts`.

See `apps/video-engine/README.md` for how videos are built (Remotion +
locally-synthesized narration, no network/API needed).

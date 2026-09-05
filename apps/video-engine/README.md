# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Product review videos

Every product review video follows the standing framework and voice profile
in [`docs/video-production/`](../../docs/video-production/) at the repo
root — read those before starting a new one:

- `SCRIPT_FRAMEWORK.md` — the 8-section scriptwriting structure (hook,
  intro, how it works, pros, cons, who it's for, verdict, CTA) and its hard
  rule: never draft a script without both the exact video title and the
  official product website link in hand.
- `VOICE_PROFILE.md` — the calibrated eSpeak NG settings (voice, pitch,
  speed) that approximate the reference voiceover sample. This is the
  standard narration voice for every video unless told otherwise.

Each video is its own Remotion composition under `src/<CompositionName>/`,
with its script and generated audio under `public/audio/<slug>/`:

- `SalesvueReview` — "Salesvue Review | Pros and Cons – Watch Before Using".
  The pros/cons/verdict content is a **draft based on general knowledge of
  Salesvue** — verify the claims before publishing anywhere public.

To rebuild a video's narration + timeline (e.g. after editing its script)
and render it:

```console
python3 scripts/build-narration.py --composition SalesvueReview
npx remotion render SalesvueReview out/salesvue-review.mp4
```

`--speed` (espeak words/min) is the one knob you'll retune per video — build
once, check the printed `totalDuration`, then adjust speed to hit the
target runtime and rebuild.

Each script line lives in `public/audio/<slug>/script.json` and is
synthesized individually so its exact duration is known, then concatenated
with silence gaps — that's what lets captions and on-screen bullets land
exactly on the spoken words without needing WhisperX or any model download.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

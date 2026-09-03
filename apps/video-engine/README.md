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

## Compositions

- `HelloWorld` / `OnlyLogo` — the default Remotion starter scenes.
- `SalesvueReview` — a ~2-minute, fully code-driven product review explainer
  ("Salesvue Review | Pros and Cons – Watch Before Using"). Narration is
  synthesized locally with eSpeak NG (no network/API needed), and every
  caption and on-screen bullet is timed exactly to that audio.

  The pros/cons/verdict content is a **draft based on general knowledge of
  Salesvue** — verify the claims before publishing anywhere public.

  To rebuild the narration + timeline (e.g. after editing the script) and
  render the video:

  ```console
  python3 scripts/build-narration.py   # regenerates public/audio/narration.mp3 + src/SalesvueReview/timeline.json
  npx remotion render SalesvueReview out/salesvue-review.mp4
  ```

  The script text lives in `public/audio/script.json`. Each line is
  synthesized individually so its exact duration is known, then concatenated
  with silence gaps — that's what lets captions and bullet reveals line up
  with the spoken words without needing WhisperX or any model download.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

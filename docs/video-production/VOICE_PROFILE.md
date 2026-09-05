# Standard Narration Voice

This is the standard voiceover profile for every product review video
(Salesvue, Wordtune, and future ones), calibrated to match
`reference-voice/reference-voiceover.mp3` — a real voiceover sample the user
provided as the target sound.

## Why it's approximated, not cloned

There's no real neural TTS or voice-cloning model available in this sandbox
(no network access to ElevenLabs/HuggingFace/etc.). Narration is synthesized
locally with **eSpeak NG**, a formant synthesizer — it can match pitch and
pacing, but it cannot reproduce a specific human's timbre, so it's an
approximation, not a clone. If real voice cloning becomes available (e.g. on
a machine with internet access), feed it `reference-voiceover.mp3` directly
as the reference/target voice instead of using the eSpeak parameters below.

## Reference sample analysis

Measured with a simple autocorrelation pitch tracker
(`apps/video-engine/scripts/analyze_pitch.py`) over `reference-voiceover.mp3`:

- Duration: 219.8s
- Median F0 (fundamental pitch): **114.3 Hz**
- Mean F0: 133.9 Hz (pulled up by expressive/emphasis peaks)
- P10–P90 range: 90.9–197.5 Hz

This is a typical adult male conversational pitch — energetic and
expressive (wide pitch range for emphasis), not a deep bass or an "old man"
gravelly voice. This **replaces** the earlier "grandpa" deep-old-man eSpeak
voice used for the first Salesvue render — that was a guess before we had a
real reference; this profile is calibrated to the actual sample.

## Calibrated eSpeak NG parameters

```
voice: en-us
pitch: 62      # espeak -p (0-99 scale, default 50); tuned to hit ~114Hz median
speed: 165wpm  # espeak -s; adjust per-video to hit the target video length
amplitude: 170 # espeak -a (0-200)
```

Calibration check (median F0 of eSpeak output at each pitch setting, using
the same autocorrelation tracker against a short test sentence):

| espeak -p | median F0 |
|-----------|-----------|
| 25        | 82.9 Hz   |
| 45        | 96.3 Hz   |
| 55        | 106.0 Hz  |
| 58        | 110.8 Hz  |
| **62**    | **115.4 Hz** ✅ closest match to reference's 114.3 Hz |
| 68        | 122.5 Hz  |

## Usage

`apps/video-engine/scripts/build-narration.py` defaults to this profile.
Only `speed` needs retuning per video, to land the narration at the target
runtime (build the narration first, check `totalDuration` in the printed
output, then adjust speed and re-run until it's close to the target).

# Standard Narration Voice

This is the standard voiceover profile for every product review video
(Salesvue, Wordtune, and future ones), calibrated to match
`reference-voice/reference-voiceover.mp3` — a real voiceover sample the user
provided as the target sound.

## Why it's approximated, not cloned (in this sandbox)

There's no real neural TTS or voice-cloning model reachable from this
sandbox (network egress blocks `api.fish.audio`, `huggingface.co`, and most
hosts outside a small package-registry allowlist — confirmed by direct
`curl` and by the script itself failing with "Tunnel connection failed: 403
Forbidden"). Narration falls back to **eSpeak NG**, a formant synthesizer —
it can match pitch and pacing, but it cannot reproduce a specific human's
timbre, so it's an approximation, not a clone.

**A real cloned-voice option now exists in the script** — the user has a
Fish Audio (fish.audio) account with a trained voice model. `build-narration.py
--voice-backend fish --fish-voice-id <id>` calls Fish Audio's TTS API with
that voice instead of eSpeak, producing an actual clone rather than an
approximation. It's wired up and its error handling is verified (a deliberate
bad connection raises a clean, readable error) but the **happy path is
unverified from this sandbox** — run it from a machine that can reach
`api.fish.audio` to actually hear the output.

**Never put the API key in a file, script argument default, or commit.** Set
it as an environment variable only:
```
export FISH_AUDIO_API_KEY="sk-fish-..."
export FISH_AUDIO_VOICE_ID="<voice model id>"
python3 scripts/build-narration.py --composition PodiaReview --voice-backend fish
```
The script reads both from the environment by default (see `--fish-api-key`
/ `--fish-voice-id` in its `--help`); it never writes the key anywhere.

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
